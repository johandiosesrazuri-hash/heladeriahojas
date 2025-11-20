package com.choccoDelight.dto;

import java.time.LocalDate;
import java.util.List;

public class PromocionDTO {
    private Long id;
    private String nombrePromo;
    private String descripcion;
    private Double precioTotal; // Precio final del combo
    private Double descuento;
    private String imagenUrl;
    private Boolean activo;
    private java.time.LocalDate fechaInicio;
    private LocalDate fechaFin;
    private List<ProductoPromoDTO> productos; // Lista de productos

    // Clase interna para productos en la promo
    public static class ProductoPromoDTO {
        private Long productoId;
        private String nombre;
        private Integer cantidad;
        private Double precioUnitario;
        
        public Integer getCantidad() {
            return cantidad;
        }  
        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }
        public Long getProductoId() {
            return productoId;
        }
        public void setProductoId(Long productoId) {
            this.productoId = productoId;
        }
        public String getNombre() {
            return nombre;
        }
        public void setNombre(String nombre) {
            this.nombre = nombre;
        }
        public Double getPrecioUnitario() {
            return precioUnitario;
        }
        public void setPrecioUnitario(Double precioUnitario) {
            this.precioUnitario = precioUnitario;
        }
    }
    // Getters y Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNombrePromo() {
        return nombrePromo;
    }
    public void setNombrePromo(String nombrePromo) {
        this.nombrePromo = nombrePromo;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public Double getPrecioTotal() {
        return precioTotal;
    }
    public void setPrecioTotal(Double precioTotal) {
        this.precioTotal = precioTotal;
    }
    public Double getDescuento() {
        return descuento;
    }
    public void setDescuento(Double descuento) {
        this.descuento = descuento;
    }
    public String getImagenUrl() {
        return imagenUrl;
    }
    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }
    public Boolean getActivo() {
        return activo;
    }
    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
    public java.time.LocalDate getFechaInicio() {
        return fechaInicio;
    }
    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }
    public java.time.LocalDate getFechaFin() {
        return fechaFin;
    }
    public void setFechaFin(java.time.LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }
    public List<ProductoPromoDTO> getProductos() {
        return productos;
    }
    public void setProductos(List<ProductoPromoDTO> productos) {
        this.productos = productos;
    }
}
