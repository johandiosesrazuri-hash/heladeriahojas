package com.choccoDelight.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.Date;

@Entity
public class Testimonio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;  // Relación con la entidad Usuario

    @Column(nullable = false)
    private String mensaje;  // Mensaje del testimonio

    @Column(nullable = false)
    private int calificacion;  // Calificación del testimonio

    @Column(nullable = false)
    private Timestamp fecha;  // Fecha en que se dejó el testimonio
    
    // Constructor
    public Testimonio() {
    }

    public Testimonio(Usuario usuario, String mensaje, int calificacion, Timestamp fecha) {
        this.usuario = usuario;
        this.mensaje = mensaje;
        this.calificacion = calificacion;
        this.fecha = fecha;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public int getCalificacion() {
        return calificacion;
    }

    public void setCalificacion(int calificacion) {
        this.calificacion = calificacion;
    }

    public Timestamp getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = new Timestamp(fecha.getTime());
    }

    @Override
    public String toString() {
        return "Testimonio{" +
                "id=" + id +
                ", usuario=" + usuario.getUsername() + // Asumiendo que la entidad Usuario tiene un método getNombre()
                ", mensaje='" + mensaje + '\'' +
                ", calificacion=" + calificacion +
                ", fecha=" + fecha +
                '}';
    }
}
