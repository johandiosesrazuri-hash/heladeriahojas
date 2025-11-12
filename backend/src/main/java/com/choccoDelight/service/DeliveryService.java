package com.choccoDelight.service;

import com.choccoDelight.entity.Delivery;
import com.choccoDelight.entity.Pedido;
import com.choccoDelight.repository.DeliveryRepository;
import com.choccoDelight.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    public Delivery guardarDelivery(Delivery delivery) {
        Long pedidoId = delivery.getPedido().getId();
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        delivery.setPedido(pedido);
        return deliveryRepository.save(delivery);
    }
}
