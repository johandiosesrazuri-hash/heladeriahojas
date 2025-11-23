package com.choccoDelight.repository;

import com.choccoDelight.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    Optional<Delivery> findByPedidoId(Long pedidoId);
    void deleteByPedidoId(Long pedidoId);
}
