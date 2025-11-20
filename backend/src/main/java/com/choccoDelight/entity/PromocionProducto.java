package com.choccoDelight.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "promocion_productos")
public class PromocionProducto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "promocion_id", nullable = false)
    private Promocion promocion;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad = 1; // Cantidad de este producto en la promo

    @Column(name = "precio_unitario")
    private BigDecimal precioUnitario; // Precio específico en esta promo

    public Integer getCantidad() {
        return cantidad;
    }public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }public Long getId() {
        return id;
    }public void setId(Long id) {
        this.id = id;
    }public Promocion getPromocion() {
        return promocion;
    }public void setPromocion(Promocion promocion) {
        this.promocion = promocion;
    }public Producto getProducto() {
        return producto;
    }public void setProducto(Producto producto) {
        this.producto = producto;
    }public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }
}