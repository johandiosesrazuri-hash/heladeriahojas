package com.choccoDelight.dto;

public class PromocionDTO {
    private Long id;
    private String nombrePromo;
    private String descripcion;
    private Double precio;
    private Double descuento;
    private String imagen;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombrePromo() { return nombrePromo; }
    public void setNombrePromo(String nombrePromo) { this.nombrePromo = nombrePromo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public Double getDescuento() { return descuento; }
    public void setDescuento(Double descuento) { this.descuento = descuento; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }
}
