package com.choccoDelight.dto;

import java.math.BigDecimal;
import java.util.List;

import com.choccoDelight.entity.Delivery;

public class PedidoRequest {
    public List<ItemRequest> items;
    public Delivery delivery;
    public String metodoPago;

    public static class ItemRequest {
        public Long productoId;
        public Long promocionId; // Nuevo campo para promociones
        public int cantidad;
        public BigDecimal precioUnitario;
    }

    public Delivery getDelivery() {
        return delivery;
    }

    public void setDelivery(Delivery delivery) {
        this.delivery = delivery;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }
}