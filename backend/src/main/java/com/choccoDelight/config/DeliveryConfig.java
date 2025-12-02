package com.choccoDelight.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
@ConfigurationProperties(prefix = "delivery")
public class DeliveryConfig {
    
    private Precio precio = new Precio();
    private Radio radio = new Radio();
    private Heladeria heladeria = new Heladeria();

    public static class Precio {
        private BigDecimal base = new BigDecimal("5.00");
        private BigDecimal porKm = new BigDecimal("2.50");

        public BigDecimal getBase() {
            return base;
        }

        public void setBase(BigDecimal base) {
            this.base = base;
        }

        public BigDecimal getPorKm() {
            return porKm;
        }

        public void setPorKm(BigDecimal porKm) {
            this.porKm = porKm;
        }
    }

    public static class Radio {
        private Integer maximoKm = 10;

        public Integer getMaximoKm() {
            return maximoKm;
        }

        public void setMaximoKm(Integer maximoKm) {
            this.maximoKm = maximoKm;
        }
    }

    public static class Heladeria {
        private Double latitud = -12.0464;
        private Double longitud = -77.0428;

        public Double getLatitud() {
            return latitud;
        }

        public void setLatitud(Double latitud) {
            this.latitud = latitud;
        }

        public Double getLongitud() {
            return longitud;
        }

        public void setLongitud(Double longitud) {
            this.longitud = longitud;
        }
    }

    public Precio getPrecio() {
        return precio;
    }

    public void setPrecio(Precio precio) {
        this.precio = precio;
    }

    public Radio getRadio() {
        return radio;
    }

    public void setRadio(Radio radio) {
        this.radio = radio;
    }

    public Heladeria getHeladeria() {
        return heladeria;
    }

    public void setHeladeria(Heladeria heladeria) {
        this.heladeria = heladeria;
    }
}
