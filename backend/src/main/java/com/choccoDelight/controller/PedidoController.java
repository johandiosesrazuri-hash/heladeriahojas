package com.choccoDelight.controller;

import com.choccoDelight.entity.DetallePedido;
import com.choccoDelight.entity.Delivery;
import com.choccoDelight.entity.Pedido;
import com.choccoDelight.entity.Producto;
import com.choccoDelight.entity.Usuario;
import com.choccoDelight.repository.ProductoRepository;
import com.choccoDelight.repository.UsuarioRepository;
import com.choccoDelight.service.DeliveryService;
import com.choccoDelight.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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
    private ProductoRepository productoRepository;

    @Autowired
    private DeliveryService deliveryService;

    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody PedidoRequest body, Authentication authentication) {

        // Validar autenticación
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body("No autenticado");
        }

        // Buscar usuario
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Crear pedido
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);

        // ✅ AGREGAR ESTA SECCIÓN - Configurar método de pago
        String metodoPago = body.getMetodoPago() != null ? body.getMetodoPago() : "efectivo";
        pedido.setMetodoPago(metodoPago);

        // Configurar estado según método de pago
        switch (metodoPago) {
            case "efectivo":
                pedido.setEstado(Pedido.EstadoPedido.PENDIENTE);
                pedido.setPagado(false);  // Se paga al recibir
                break;
            case "transferencia":
                pedido.setEstado(Pedido.EstadoPedido.PENDIENTE_PAGO);
                pedido.setPagado(false);  // Esperando confirmación
                break;
            case "tarjeta":
                pedido.setEstado(Pedido.EstadoPedido.PENDIENTE);
                pedido.setPagado(true);  // Pago procesado
                break;
            default:
                pedido.setEstado(Pedido.EstadoPedido.PENDIENTE);
                pedido.setPagado(false);
        }
        // ✅ FIN DE LA SECCIÓN NUEVA

        List<DetallePedido> detalles = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        // Procesar los items enviados desde React
        for (Item it : body.getItems()) {

            // Buscar producto real en BD
            Producto producto = productoRepository.findById(it.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            // Crear detalle
            DetallePedido det = new DetallePedido();
            det.setProducto(producto);
            det.setCantidad(it.getCantidad());

            // Precio real del producto desde DB (ignora el del front)
            det.setPrecioUnitario(producto.getPrecio());

            // Subtotal
            BigDecimal subtotal = producto.getPrecio()
                    .multiply(BigDecimal.valueOf(it.getCantidad()));

            det.setSubtotal(subtotal);
            detalles.add(det);

            total = total.add(subtotal);
        }

        pedido.setTotal(total);

        // Guardar pedido y detalles
        Pedido creado = pedidoService.crearPedido(pedido, detalles);

        // Guardar delivery si viene desde React
        if (body.getDelivery() != null) {
            Delivery d = body.getDelivery();
            d.setPedido(creado);
            deliveryService.guardarDelivery(d);
        }

        return ResponseEntity.ok(creado);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Pedido>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(pedidoService.listarPedidosPorUsuario(usuarioId));
    }

    // ==== DTOs ====

    public static class PedidoRequest {
        private List<Item> items;
        private Delivery delivery;
        private String metodoPago;  // ✅ AGREGAR ESTA LÍNEA

        public List<Item> getItems() { return items; }
        public void setItems(List<Item> items) { this.items = items; }

        public Delivery getDelivery() { return delivery; }
        public void setDelivery(Delivery delivery) { this.delivery = delivery; }

        // ✅ AGREGAR GETTER Y SETTER
        public String getMetodoPago() { return metodoPago; }
        public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
    }

    public static class Item {
        private Long productoId;
        private Integer cantidad;

        public Long getProductoId() { return productoId; }
        public void setProductoId(Long productoId) { this.productoId = productoId; }

        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    }
}