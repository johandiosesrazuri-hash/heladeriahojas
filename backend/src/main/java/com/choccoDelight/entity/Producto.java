package com.choccoDelight.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
@Entity
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(length = 1000)
    private String descripcion;

    @Column(nullable = false)
    private BigDecimal precio;

    private String imagen;

    @Column(name = "stock_disponible")
    private Integer stockDisponible;

    @Column(name = "categoria")
    private String categoria;

    private Boolean activo = true;

    // Getters and setters (explicit to avoid Lombok)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }
    public Integer getStockDisponible() { return stockDisponible; }
    public void setStockDisponible(Integer stockDisponible) { this.stockDisponible = stockDisponible; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}