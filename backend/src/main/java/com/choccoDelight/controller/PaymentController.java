package com.choccoDelight.controller;

import com.choccoDelight.config.PaymentConfig;
import com.choccoDelight.dto.PaymentInfoDTO;
import com.choccoDelight.entity.Pedido;
import com.choccoDelight.entity.Usuario;
import com.choccoDelight.repository.PedidoRepository;
import com.choccoDelight.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Autowired
    private PaymentConfig paymentConfig;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Usar ruta absoluta basada en el directorio de trabajo actual
    private static final String UPLOAD_DIR = "src/main/resources/static/img/comprobantes/";
    // Tamaño máximo: 10MB
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;
    // Resolución máxima para redimensionar (ancho máximo en píxeles)
    private static final int MAX_WIDTH = 1920;
    private static final int MAX_HEIGHT = 1920;

    @GetMapping("/info")
    public ResponseEntity<PaymentInfoDTO> getPaymentInfo() {
        PaymentInfoDTO.YapeInfo yape = new PaymentInfoDTO.YapeInfo(
            paymentConfig.getYape().getQr().getPath()
        );

        PaymentInfoDTO.BankInfo bank = new PaymentInfoDTO.BankInfo(
            paymentConfig.getBank().getName(),
            paymentConfig.getBank().getAccount(),
            paymentConfig.getBank().getCci(),
            paymentConfig.getBank().getHolder(),
            paymentConfig.getBank().getType()
        );

        PaymentInfoDTO info = new PaymentInfoDTO(yape, bank);
        return ResponseEntity.ok(info);
    }

    @PostMapping("/comprobante/{pedidoId}")
    public ResponseEntity<?> subirComprobante(
            @PathVariable Long pedidoId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body("No autenticado");
        }

        // Buscar usuario
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Buscar pedido
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        // Verificar que el pedido pertenece al usuario
        if (!pedido.getUsuario().getId().equals(usuario.getId())) {
            return ResponseEntity.status(403).body("No autorizado");
        }

        // Validar archivo
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Archivo vacío");
        }

        // Validar tamaño de archivo (máximo 10MB)
        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body("El archivo es demasiado grande. Tamaño máximo: 10MB. Por favor, usa una imagen con menor resolución.");
        }

        // Validar tipo de archivo (solo imágenes)
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body("Solo se permiten imágenes");
        }

        try {
            // Crear directorio si no existe
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generar nombre único
            String originalFileName = file.getOriginalFilename();
            String extension = originalFileName != null && originalFileName.contains(".")
                    ? originalFileName.substring(originalFileName.lastIndexOf("."))
                    : ".jpg";
            String fileName = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(fileName);

            // Leer la imagen
            BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(file.getBytes()));
            
            if (originalImage == null) {
                return ResponseEntity.badRequest().body("No se pudo procesar la imagen");
            }

            // Redimensionar si excede las dimensiones máximas
            BufferedImage imageToSave = resizeImageIfNeeded(originalImage, MAX_WIDTH, MAX_HEIGHT);

            // Guardar la imagen (original o redimensionada)
            String formatName = extension.substring(1).toLowerCase();
            if (formatName.equals("jpg")) {
                formatName = "jpeg";
            }
            ImageIO.write(imageToSave, formatName, filePath.toFile());

            // Actualizar pedido
            String urlComprobante = "/img/comprobantes/" + fileName;
            pedido.setComprobantePago(urlComprobante);
            pedido.setPagoRechazado(false); // Limpiar flag de rechazo al subir nuevo comprobante
            pedido.setMotivoRechazo(null); // Limpiar motivo
            
            // Si el método de pago es Yape o Transferencia, cambiar estado a PENDIENTE_PAGO
            if ("yape".equals(pedido.getMetodoPago()) || "transferencia".equals(pedido.getMetodoPago())) {
                pedido.setEstado(Pedido.EstadoPedido.PENDIENTE_PAGO);
            }
            
            pedidoRepository.save(pedido);

            return ResponseEntity.ok().body(new ComprobanteResponse(urlComprobante, "Comprobante subido exitosamente"));

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error al guardar el archivo: " + e.getMessage());
        }
    }

    @PostMapping("/validar/{pedidoId}")
    public ResponseEntity<?> validarPago(
            @PathVariable Long pedidoId,
            Authentication authentication) {

        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body("No autenticado");
        }

        // Buscar usuario
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar que es admin
        if (usuario.getRol() != Usuario.Role.ADMIN) {
            return ResponseEntity.status(403).body("Solo administradores pueden validar pagos");
        }

        // Buscar pedido
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        // Validar que tenga comprobante
        if (pedido.getComprobantePago() == null || pedido.getComprobantePago().isEmpty()) {
            return ResponseEntity.badRequest().body("El pedido no tiene comprobante de pago");
        }

        // Actualizar pedido
        pedido.setPagado(true);
        pedido.setFechaValidacionPago(LocalDateTime.now());
        pedido.setEstado(Pedido.EstadoPedido.CONFIRMADO);
        pedido.setPagoRechazado(false); // Limpiar flag de rechazo
        pedido.setMotivoRechazo(null); // Limpiar motivo
        
        pedidoRepository.save(pedido);

        return ResponseEntity.ok().body("Pago validado exitosamente");
    }

    @PostMapping("/rechazar/{pedidoId}")
    public ResponseEntity<?> rechazarPago(
            @PathVariable Long pedidoId,
            @RequestBody(required = false) Map<String, String> body,
            Authentication authentication) {

        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body("No autenticado");
        }

        // Buscar usuario
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar que es admin
        if (usuario.getRol() != Usuario.Role.ADMIN) {
            return ResponseEntity.status(403).body("Solo administradores pueden rechazar pagos");
        }

        // Buscar pedido
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        // Obtener motivo del rechazo (opcional)
        String motivo = body != null ? body.get("motivo") : null;

        // Actualizar pedido
        pedido.setPagado(false);
        pedido.setComprobantePago(null); // Eliminar comprobante rechazado
        pedido.setEstado(Pedido.EstadoPedido.CANCELADO); // Cancelar el pedido automáticamente
        pedido.setPagoRechazado(true); // Marcar como rechazado para notificación
        pedido.setMotivoRechazo(motivo); // Guardar motivo
        
        pedidoRepository.save(pedido);

        return ResponseEntity.ok().body(motivo != null ? 
            "Pago rechazado y pedido cancelado: " + motivo : 
            "Pago rechazado. El pedido ha sido cancelado.");
    }

    /**
     * Redimensiona una imagen si excede las dimensiones máximas, manteniendo la relación de aspecto
     */
    private BufferedImage resizeImageIfNeeded(BufferedImage originalImage, int maxWidth, int maxHeight) {
        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();

        // Si la imagen ya es más pequeña que el máximo, retornarla sin cambios
        if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
            return originalImage;
        }

        // Calcular nuevas dimensiones manteniendo la relación de aspecto
        double widthRatio = (double) maxWidth / originalWidth;
        double heightRatio = (double) maxHeight / originalHeight;
        double ratio = Math.min(widthRatio, heightRatio);

        int newWidth = (int) (originalWidth * ratio);
        int newHeight = (int) (originalHeight * ratio);

        // Crear nueva imagen redimensionada con mejor calidad
        BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = resizedImage.createGraphics();
        
        // Configurar para mejor calidad
        graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
        graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        
        graphics.drawImage(originalImage, 0, 0, newWidth, newHeight, null);
        graphics.dispose();

        return resizedImage;
    }

    // DTO para respuesta
    static class ComprobanteResponse {
        private String url;
        private String message;

        public ComprobanteResponse(String url, String message) {
            this.url = url;
            this.message = message;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
