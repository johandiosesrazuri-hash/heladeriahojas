package com.choccoDelight.dto;

import com.choccoDelight.entity.Direccion;
import com.choccoDelight.entity.Pedido;
import com.choccoDelight.entity.Testimonio;
import com.choccoDelight.entity.Usuario;
import java.util.List;

public class PerfilDTO {
    private Long id;
    private String nombre;
    private String email;
    private String telefono;
    private String avatarUrl;
    private Usuario.Role rol;
    private List<Direccion> direcciones;
    private List<Pedido> pedidos;
    private List<Testimonio> testimonios;

    public PerfilDTO() {}

    public PerfilDTO(Usuario usuario,
                     List<Direccion> direcciones,
                     List<Pedido> pedidos,
                     List<Testimonio> testimonios) {
        this.id = usuario.getId();
        this.nombre = usuario.getNombre();
        this.email = usuario.getEmail();
        this.telefono = usuario.getTelefono();
        this.avatarUrl = usuario.getAvatarUrl();
        this.rol = usuario.getRol();
        this.direcciones = direcciones;
        this.pedidos = pedidos;
        this.testimonios = testimonios;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public Usuario.Role getRol() { return rol; }
    public void setRol(Usuario.Role rol) { this.rol = rol; }
    public List<Direccion> getDirecciones() { return direcciones; }
    public void setDirecciones(List<Direccion> direcciones) { this.direcciones = direcciones; }
    public List<Pedido> getPedidos() { return pedidos; }
    public void setPedidos(List<Pedido> pedidos) { this.pedidos = pedidos; }
    public List<Testimonio> getTestimonios() { return testimonios; }
    public void setTestimonios(List<Testimonio> testimonios) { this.testimonios = testimonios; }
}
