package com.choccoDelight.dto;

import java.time.LocalDateTime;

public class TestimonioDTO {
    private Long id;
    private String nombreUsuario;
    private String mensaje;
    private Integer calificacion;
    private LocalDateTime fecha;

    public TestimonioDTO() {}

    public TestimonioDTO(Long id, String nombreUsuario, String mensaje, Integer calificacion, LocalDateTime fecha) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.mensaje = mensaje;
        this.calificacion = calificacion;
        this.fecha = fecha;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }

    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }

    public Integer getCalificacion() { return calificacion; }
    public void setCalificacion(Integer calificacion) { this.calificacion = calificacion; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
}