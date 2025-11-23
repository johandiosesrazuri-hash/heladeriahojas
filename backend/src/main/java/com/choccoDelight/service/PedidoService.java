package com.choccoDelight.service;

import com.choccoDelight.entity.DetallePedido;
import com.choccoDelight.entity.Pedido;
import com.choccoDelight.entity.Producto;
import com.choccoDelight.entity.Usuario;
import com.choccoDelight.entity.Promocion;
import com.choccoDelight.repository.DetallePedidoRepository;
import com.choccoDelight.repository.PedidoRepository;
import com.choccoDelight.repository.ProductoRepository;
import com.choccoDelight.repository.UsuarioRepository;
import com.choccoDelight.repository.PromocionRepository;
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

    @Autowired
    private PromocionRepository promocionRepository;

    @Transactional
    public Pedido crearPedido(Pedido pedido, List<DetallePedido> detalles) {
        // Asociar usuario existente
        Usuario usuario = usuarioRepository.findById(pedido.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        pedido.setUsuario(usuario);

        // Calcular total
        BigDecimal total = BigDecimal.ZERO;
        for (DetallePedido d : detalles) {
            if (d.getProducto() != null) {
                Producto producto = productoRepository.findById(d.getProducto().getId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
                d.setProducto(producto);
                d.setPromocion(null);
                d.setPrecioUnitario(producto.getPrecio());
                d.setSubtotal(producto.getPrecio().multiply(BigDecimal.valueOf(d.getCantidad())));
            } else if (d.getPromocion() != null) {
                Promocion promo = promocionRepository.findById(d.getPromocion().getId())
                        .orElseThrow(() -> new RuntimeException("Promoción no encontrada"));
                d.setPromocion(promo);
                d.setProducto(null);
                BigDecimal precioPromo = promo.getPrecioTotal() != null ? promo.getPrecioTotal() : BigDecimal.ZERO;
                d.setPrecioUnitario(precioPromo);
                d.setSubtotal(precioPromo.multiply(BigDecimal.valueOf(d.getCantidad())));
            } else {
                throw new RuntimeException("Detalle inválido: sin producto ni promoción");
            }

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
