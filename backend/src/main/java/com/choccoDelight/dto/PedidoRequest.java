package com.choccoDelight.dto;

import java.math.BigDecimal;
import java.util.List;

import com.choccoDelight.entity.Delivery;

public class PedidoRequest {
    public List<ItemRequest> items;
    public Delivery delivery;
    public String metodoPago;  // ✅ AGREGAR ESTA LÍNEA

    public static class ItemRequest {
        public Long productoId;
        public int cantidad;
        public BigDecimal precioUnitario;
    }
    
    // ✅ AGREGAR GETTER Y SETTER
    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
}