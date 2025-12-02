package com.choccoDelight.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedido estado;

    // ✅ AGREGAR ESTAS DOS LÍNEAS
    @Column(name = "metodo_pago", nullable = false)
    private String metodoPago = "efectivo";

    @Column(nullable = false)
    private Boolean pagado = false;

    @Column(name = "numero_pedido")
    private Integer numeroPedido;

    @Column(name = "comprobante_pago")
    private String comprobantePago;

    @Column(name = "fecha_validacion_pago")
    private LocalDateTime fechaValidacionPago;

    @Column(name = "pago_rechazado")
    private Boolean pagoRechazado = false;

    @Column(name = "motivo_rechazo")
    private String motivoRechazo;

    @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL)
    private Delivery delivery;

    @PrePersist
    protected void onCreate() {
        fecha = LocalDateTime.now();
        if (estado == null) {
            estado = EstadoPedido.PENDIENTE;
        }
    }

    public enum EstadoPedido {
        PENDIENTE,
        PENDIENTE_PAGO,  // ✅ AGREGAR ESTE
        CONFIRMADO,
        EN_PREPARACION,
        EN_CAMINO,
        ENTREGADO,
        CANCELADO
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    
    public EstadoPedido getEstado() { return estado; }
    public void setEstado(EstadoPedido estado) { this.estado = estado; }
    
    public Delivery getDelivery() { return delivery; }
    public void setDelivery(Delivery delivery) { this.delivery = delivery; }

    // ✅ AGREGAR ESTOS GETTERS Y SETTERS
    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }

    public Boolean getPagado() { return pagado; }
    public void setPagado(Boolean pagado) { this.pagado = pagado; }

    public String getComprobantePago() { return comprobantePago; }
    public void setComprobantePago(String comprobantePago) { this.comprobantePago = comprobantePago; }

    public LocalDateTime getFechaValidacionPago() { return fechaValidacionPago; }
    public void setFechaValidacionPago(LocalDateTime fechaValidacionPago) { this.fechaValidacionPago = fechaValidacionPago; }

    public Integer getNumeroPedido() { return numeroPedido; }
    public void setNumeroPedido(Integer numeroPedido) { this.numeroPedido = numeroPedido; }

    public Boolean getPagoRechazado() { return pagoRechazado; }
    public void setPagoRechazado(Boolean pagoRechazado) { this.pagoRechazado = pagoRechazado; }

    public String getMotivoRechazo() { return motivoRechazo; }
    public void setMotivoRechazo(String motivoRechazo) { this.motivoRechazo = motivoRechazo; }
}