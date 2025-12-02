package com.choccoDelight.controller;

import com.choccoDelight.entity.DetallePedido;
import com.choccoDelight.entity.Delivery;
import com.choccoDelight.entity.Pedido;
import com.choccoDelight.entity.Producto;
import com.choccoDelight.entity.Usuario;
import com.choccoDelight.entity.Promocion;
import com.choccoDelight.repository.UsuarioRepository;
import com.choccoDelight.repository.PedidoRepository;
import com.choccoDelight.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:5173")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody PedidoRequest body, Authentication authentication) {

        // Validar autenticación
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body("No autenticado");
        }

        // Buscar usuario
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Calcular número de pedido secuencial por usuario
        int numeroPedido = pedidoRepository.findByUsuarioId(usuario.getId()).size() + 1;

        // Crear pedido
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setNumeroPedido(numeroPedido);

        String metodoPago = body.getMetodoPago() != null ? body.getMetodoPago() : "efectivo";
        pedido.setMetodoPago(metodoPago);

        switch (metodoPago) {
            case "efectivo":
                pedido.setEstado(Pedido.EstadoPedido.PENDIENTE);
                pedido.setPagado(false); // Se paga al recibir
                break;
            case "yape":
            case "transferencia":
                pedido.setEstado(Pedido.EstadoPedido.PENDIENTE_PAGO);
                pedido.setPagado(false); // Esperando confirmación
                break;
            case "tarjeta":
                pedido.setEstado(Pedido.EstadoPedido.PENDIENTE);
                pedido.setPagado(true); // Pago procesado
                break;
            default:
                pedido.setEstado(Pedido.EstadoPedido.PENDIENTE);
                pedido.setPagado(false);
        }

        // Crear lista de detalles básicos
        List<DetallePedido> detalles = new ArrayList<>();
        for (Item it : body.getItems()) {
            if (it.getProductoId() == null && it.getPromocionId() == null) {
                throw new RuntimeException("Cada item debe tener productoId o promocionId");
            }

            DetallePedido det = new DetallePedido();
            det.setCantidad(it.getCantidad());

            if (it.getProductoId() != null) {
                Producto producto = new Producto();
                producto.setId(it.getProductoId());
                det.setProducto(producto);
            } else {
                Promocion promo = new Promocion();
                promo.setId(it.getPromocionId());
                det.setPromocion(promo);
            }

            detalles.add(det);
        }

        // Agregar delivery al pedido antes de crear
        if (body.getDelivery() != null) {
            pedido.setDelivery(body.getDelivery());
        }

        // El servicio calculará el total incluyendo delivery
        Pedido creado = pedidoService.crearPedido(pedido, detalles);

        return ResponseEntity.ok(creado);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Pedido>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(pedidoService.listarPedidosPorUsuario(usuarioId));
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<Pedido>> listarPedidosPendientesDeValidacion() {
        return ResponseEntity.ok(pedidoRepository.findByComprobantePagoIsNotNullAndPagadoFalse());
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(
            @PathVariable Long id,
            @RequestBody EstadoRequest body,
            Authentication authentication) {
        
        // Validar autenticación
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body("No autenticado");
        }

        // Buscar pedido
        Pedido pedido = pedidoService.obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        // Buscar usuario actual
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar que el pedido pertenece al usuario (salvo que sea admin)
        boolean esAdmin = usuario.getRol() == Usuario.Role.ADMIN;
        boolean esPropietario = pedido.getUsuario().getId().equals(usuario.getId());
        
        if (!esAdmin && !esPropietario) {
            return ResponseEntity.status(403).body("No tienes permiso para modificar este pedido");
        }

        // Solo permitir cancelación si está en estados iniciales
        if ("CANCELADO".equals(body.getEstado())) {
            if (pedido.getEstado() == Pedido.EstadoPedido.ENTREGADO || 
                pedido.getEstado() == Pedido.EstadoPedido.CANCELADO) {
                return ResponseEntity.badRequest()
                    .body("No se puede cancelar un pedido que ya fue entregado o cancelado");
            }
        }

        // Cambiar estado
        try {
            Pedido.EstadoPedido nuevoEstado = Pedido.EstadoPedido.valueOf(body.getEstado());
            pedido.setEstado(nuevoEstado);
            pedidoService.actualizarPedido(pedido);
            return ResponseEntity.ok(pedido);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Estado inválido: " + body.getEstado());
        }
    }

    // DTOs

    public static class PedidoRequest {
        private List<Item> items;
        private Delivery delivery;
        private String metodoPago;

        public List<Item> getItems() {
            return items;
        }

        public void setItems(List<Item> items) {
            this.items = items;
        }

        public Delivery getDelivery() {
            return delivery;
        }

        public void setDelivery(Delivery delivery) {
            this.delivery = delivery;
        }

        // ✅ AGREGAR GETTER Y SETTER
        public String getMetodoPago() {
            return metodoPago;
        }

        public void setMetodoPago(String metodoPago) {
            this.metodoPago = metodoPago;
        }
    }

    public static class Item {
        private Long productoId;
        private Long promocionId;
        private Integer cantidad;

        public Long getProductoId() {
            return productoId;
        }

        public void setProductoId(Long productoId) {
            this.productoId = productoId;
        }

        public Long getPromocionId() {
            return promocionId;
        }

        public void setPromocionId(Long promocionId) {
            this.promocionId = promocionId;
        }

        public Integer getCantidad() {
            return cantidad;
        }

        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }
    }

    public static class EstadoRequest {
        private String estado;

        public String getEstado() {
            return estado;
        }

        public void setEstado(String estado) {
            this.estado = estado;
        }
    }
}
