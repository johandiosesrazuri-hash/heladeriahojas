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
        // Obtener usuario desde el token (email)
        String username = authentication != null ? authentication.getName() : null;
        if (username == null) {
            return ResponseEntity.status(401).body("No autenticado");
        }
        Usuario usuario = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Construir Pedido
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);

        List<DetallePedido> detalles = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        for (Item it : body.getItems()) {
            Producto producto = productoRepository.findById(it.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
            DetallePedido d = new DetallePedido();
            d.setProducto(producto);
            d.setCantidad(it.getCantidad());
            d.setPrecioUnitario(it.getPrecioUnitario());
            d.setSubtotal(it.getPrecioUnitario().multiply(BigDecimal.valueOf(it.getCantidad())));
            detalles.add(d);
            total = total.add(d.getSubtotal());
        }
        pedido.setTotal(total);

        Pedido creado = pedidoService.crearPedido(pedido, detalles);

        // Guardar delivery si existe
        if (body.getDelivery() != null) {
            Delivery delivery = body.getDelivery();
            delivery.setPedido(creado);
            deliveryService.guardarDelivery(delivery);
        }

        return ResponseEntity.ok(creado);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Pedido>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(pedidoService.listarPedidosPorUsuario(usuarioId));
    }

    // DTOs
    public static class PedidoRequest {
        private List<Item> items;
        private Delivery delivery;

        public List<Item> getItems() { return items; }
        public void setItems(List<Item> items) { this.items = items; }
        public Delivery getDelivery() { return delivery; }
        public void setDelivery(Delivery delivery) { this.delivery = delivery; }
    }

    public static class Item {
        private Long productoId;
        private Integer cantidad;
        private java.math.BigDecimal precioUnitario;

        public Long getProductoId() { return productoId; }
        public void setProductoId(Long productoId) { this.productoId = productoId; }
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
        public java.math.BigDecimal getPrecioUnitario() { return precioUnitario; }
        public void setPrecioUnitario(java.math.BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
    }
}
