package com.choccoDelight.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "direcciones")
public class Direccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(length = 50)
    private String alias;

    @Column(name = "linea1", length = 200, nullable = false)
    private String linea1;

    @Column(name = "linea2", length = 200)
    private String linea2;

    @Column(length = 100)
    private String ciudad;

    @Column(length = 100)
    private String region;

    @Column(length = 20)
    private String cp;

    @Column(columnDefinition = "TEXT")
    private String referencias;

    @Column(nullable = false)
    private Boolean principal = false;

    @Column(nullable = false)
    private Boolean activo = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public String getAlias() { return alias; }
    public void setAlias(String alias) { this.alias = alias; }
    public String getLinea1() { return linea1; }
    public void setLinea1(String linea1) { this.linea1 = linea1; }
    public String getLinea2() { return linea2; }
    public void setLinea2(String linea2) { this.linea2 = linea2; }
    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getCp() { return cp; }
    public void setCp(String cp) { this.cp = cp; }
    public String getReferencias() { return referencias; }
    public void setReferencias(String referencias) { this.referencias = referencias; }
    public Boolean getPrincipal() { return principal; }
    public void setPrincipal(Boolean principal) { this.principal = principal; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}
