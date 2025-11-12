package com.choccoDelight.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "deliveries")
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @Column(nullable = false)
    private String direccion;

    @Column(nullable = false)
    private String telefono;

    @Column(name = "fecha_envio")
    private LocalDateTime fechaEnvio;

    @Column(nullable = false)
    private String ciudad;

    @Column(name = "codigo_postal")
    private String codigoPostal;

    @Column(name = "instrucciones_especiales")
    private String instruccionesEspeciales;

    @Column(name = "nombre_receptor")
    private String nombreReceptor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoDelivery estado;

    public enum EstadoDelivery {
        PENDIENTE,
        ASIGNADO,
        EN_CAMINO,
        ENTREGADO,
        FALLIDO
    }

    @PrePersist
    protected void onCreate() {
        if (estado == null) {
            estado = EstadoDelivery.PENDIENTE;
        }
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public LocalDateTime getFechaEnvio() { return fechaEnvio; }
    public void setFechaEnvio(LocalDateTime fechaEnvio) { this.fechaEnvio = fechaEnvio; }
    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }
    public String getCodigoPostal() { return codigoPostal; }
    public void setCodigoPostal(String codigoPostal) { this.codigoPostal = codigoPostal; }
    public String getInstruccionesEspeciales() { return instruccionesEspeciales; }
    public void setInstruccionesEspeciales(String instruccionesEspeciales) { this.instruccionesEspeciales = instruccionesEspeciales; }
    public String getNombreReceptor() { return nombreReceptor; }
    public void setNombreReceptor(String nombreReceptor) { this.nombreReceptor = nombreReceptor; }
    public EstadoDelivery getEstado() { return estado; }
    public void setEstado(EstadoDelivery estado) { this.estado = estado; }
}