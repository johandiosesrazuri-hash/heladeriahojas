package com.choccoDelight.dto;

import com.choccoDelight.entity.Pedido;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PedidoDTO {
    private Long id;
    private Long usuarioId;
    private String usuarioNombre;
    private String usuarioEmail;
    private LocalDateTime fecha;
    private BigDecimal total;
    private String estado;
    private String metodoPago;
    private Boolean pagado;
    
    // Información de delivery (si existe)
    private DeliveryDTO delivery;

    // Constructor vacío
    public PedidoDTO() {}

    // Constructor desde entidad Pedido
    public PedidoDTO(Pedido pedido) {
        this.id = pedido.getId();
        this.usuarioId = pedido.getUsuario().getId();
        this.usuarioNombre = pedido.getUsuario().getNombre();
        this.usuarioEmail = pedido.getUsuario().getEmail();
        this.fecha = pedido.getFecha();
        this.total = pedido.getTotal();
        this.estado = pedido.getEstado().name();
        this.metodoPago = pedido.getMetodoPago();
        this.pagado = pedido.getPagado();
        
        // Agregar delivery si existe
        if (pedido.getDelivery() != null) {
            this.delivery = new DeliveryDTO(pedido.getDelivery());
        }
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getUsuarioNombre() { return usuarioNombre; }
    public void setUsuarioNombre(String usuarioNombre) { this.usuarioNombre = usuarioNombre; }

    public String getUsuarioEmail() { return usuarioEmail; }
    public void setUsuarioEmail(String usuarioEmail) { this.usuarioEmail = usuarioEmail; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }

    public Boolean getPagado() { return pagado; }
    public void setPagado(Boolean pagado) { this.pagado = pagado; }

    public DeliveryDTO getDelivery() { return delivery; }
    public void setDelivery(DeliveryDTO delivery) { this.delivery = delivery; }

    // DTO interno para Delivery
    public static class DeliveryDTO {
        private String nombreReceptor;
        private String direccion;
        private String ciudad;
        private String telefono;
        private String instruccionesEspeciales;

        public DeliveryDTO() {}

        public DeliveryDTO(com.choccoDelight.entity.Delivery delivery) {
            this.nombreReceptor = delivery.getNombreReceptor();
            this.direccion = delivery.getDireccion();
            this.ciudad = delivery.getCiudad();
            this.telefono = delivery.getTelefono();
            this.instruccionesEspeciales = delivery.getInstruccionesEspeciales();
        }

        // Getters y Setters
        public String getNombreReceptor() { return nombreReceptor; }
        public void setNombreReceptor(String nombreReceptor) { this.nombreReceptor = nombreReceptor; }

        public String getDireccion() { return direccion; }
        public void setDireccion(String direccion) { this.direccion = direccion; }

        public String getCiudad() { return ciudad; }
        public void setCiudad(String ciudad) { this.ciudad = ciudad; }

        public String getTelefono() { return telefono; }
        public void setTelefono(String telefono) { this.telefono = telefono; }

        public String getInstruccionesEspeciales() { return instruccionesEspeciales; }
        public void setInstruccionesEspeciales(String instruccionesEspeciales) { 
            this.instruccionesEspeciales = instruccionesEspeciales; 
        }
    }
}