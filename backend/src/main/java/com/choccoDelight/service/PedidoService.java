package com.choccoDelight.service;

import com.choccoDelight.entity.DetallePedido;
import com.choccoDelight.entity.Pedido;
import com.choccoDelight.entity.Producto;
import com.choccoDelight.entity.Usuario;
import com.choccoDelight.repository.DetallePedidoRepository;
import com.choccoDelight.repository.PedidoRepository;
import com.choccoDelight.repository.ProductoRepository;
import com.choccoDelight.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Transactional
    public Pedido crearPedido(Pedido pedido, List<DetallePedido> detalles) {
        // Asociar usuario existente
        Usuario usuario = usuarioRepository.findById(pedido.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        pedido.setUsuario(usuario);

        // Calcular total
        BigDecimal total = BigDecimal.ZERO;
        for (DetallePedido d : detalles) {
            Producto producto = productoRepository.findById(d.getProducto().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
            d.setProducto(producto);
            d.setPrecioUnitario(producto.getPrecio());
            d.setSubtotal(producto.getPrecio().multiply(BigDecimal.valueOf(d.getCantidad())));
            total = total.add(d.getSubtotal());
        }
        pedido.setTotal(total);

        Pedido pedidoGuardado = pedidoRepository.save(pedido);
        for (DetallePedido d : detalles) {
            d.setPedido(pedidoGuardado);
            detallePedidoRepository.save(d);
        }

        return pedidoGuardado;
    }

    public List<Pedido> listarPedidosPorUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId);
    }
}
