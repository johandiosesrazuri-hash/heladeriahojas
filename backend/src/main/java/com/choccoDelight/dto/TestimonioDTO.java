package com.choccoDelight.dto;

import java.sql.Timestamp;

public class TestimonioDTO {

    private Long id;
    private String mensaje;
    private Long usuarioId;
    private String nombreUsuario;
    private String imagenUsuario;
    private Timestamp fecha;
    private Integer calificacion;  // Nuevo campo de calificación (puede ser Double si es una calificación decimal)

    public TestimonioDTO(Long id, String mensaje, Long usuarioId, String nombreUsuario, String imagenUsuario, Timestamp fecha, Integer calificacion) {
        this.id = id;
        this.mensaje = mensaje;
        this.usuarioId = usuarioId;
        this.nombreUsuario = nombreUsuario;
        this.imagenUsuario = imagenUsuario;
        this.fecha = fecha;
        this.calificacion = calificacion;  // Inicialización de calificación
    }

    public TestimonioDTO() {
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getImagenUsuario() {
        return imagenUsuario;
    }

    public void setImagenUsuario(String imagenUsuario) {
        this.imagenUsuario = imagenUsuario;
    }

    public Timestamp getFecha() {
        return fecha;
    }

    public void setFecha(Timestamp fecha) {
        this.fecha = fecha;
    }

    public Integer getCalificacion() {
        return calificacion;  // Método getter de calificación
    }

    public void setCalificacion(Integer calificacion) {
        this.calificacion = calificacion;  // Método setter de calificación
    }
}
