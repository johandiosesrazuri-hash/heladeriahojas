package com.choccoDelight.repository;

import com.choccoDelight.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioId(Long usuarioId);
    List<Pedido> findByUsuarioIdOrderByFechaDesc(Long usuarioId);
    // Pedidos que requieren validación de pago (tienen comprobante y no están pagados)
    List<Pedido> findByComprobantePagoIsNotNullAndPagadoFalse();
    
    // Pedidos con estado PENDIENTE_PAGO que tienen comprobante
    @Query("SELECT p FROM Pedido p WHERE p.comprobantePago IS NOT NULL AND p.pagado = false AND p.estado = 'PENDIENTE_PAGO'")
    List<Pedido> findPedidosPendientesValidacion();
}
