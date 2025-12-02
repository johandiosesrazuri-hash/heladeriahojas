package com.choccoDelight.dto;

import java.math.BigDecimal;

public class CostoDeliveryDTO {
    private BigDecimal costoDelivery;
    private Double distanciaKm;
    private boolean dentroDelRadio;
    private String mensaje;

    public CostoDeliveryDTO() {}

    public CostoDeliveryDTO(BigDecimal costoDelivery, Double distanciaKm, boolean dentroDelRadio, String mensaje) {
        this.costoDelivery = costoDelivery;
        this.distanciaKm = distanciaKm;
        this.dentroDelRadio = dentroDelRadio;
        this.mensaje = mensaje;
    }

    // Getters y Setters
    public BigDecimal getCostoDelivery() {
        return costoDelivery;
    }

    public void setCostoDelivery(BigDecimal costoDelivery) {
        this.costoDelivery = costoDelivery;
    }

    public Double getDistanciaKm() {
        return distanciaKm;
    }

    public void setDistanciaKm(Double distanciaKm) {
        this.distanciaKm = distanciaKm;
    }

    public boolean isDentroDelRadio() {
        return dentroDelRadio;
    }

    public void setDentroDelRadio(boolean dentroDelRadio) {
        this.dentroDelRadio = dentroDelRadio;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}
