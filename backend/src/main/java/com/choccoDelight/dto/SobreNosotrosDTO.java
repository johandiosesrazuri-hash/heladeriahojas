package com.choccoDelight.dto;

import com.choccoDelight.entity.*;
import java.util.List;

public class SobreNosotrosDTO {
    private SobreNosotros informacionPrincipal;
    private List<ValorEmpresa> valores;
    private List<EstadisticaEmpresa> estadisticas;
    private List<GaleriaEmpresa> galeria;

    public SobreNosotrosDTO() {}

    public SobreNosotrosDTO(SobreNosotros informacionPrincipal, 
                           List<ValorEmpresa> valores,
                           List<EstadisticaEmpresa> estadisticas,
                           List<GaleriaEmpresa> galeria) {
        this.informacionPrincipal = informacionPrincipal;
        this.valores = valores;
        this.estadisticas = estadisticas;
        this.galeria = galeria;
    }

    // Getters y Setters
    public SobreNosotros getInformacionPrincipal() { 
        return informacionPrincipal; 
    }
    public void setInformacionPrincipal(SobreNosotros informacionPrincipal) { 
        this.informacionPrincipal = informacionPrincipal; 
    }

    public List<ValorEmpresa> getValores() { return valores; }
    public void setValores(List<ValorEmpresa> valores) { 
        this.valores = valores; 
    }

    public List<EstadisticaEmpresa> getEstadisticas() { 
        return estadisticas; 
    }
    public void setEstadisticas(List<EstadisticaEmpresa> estadisticas) { 
        this.estadisticas = estadisticas; 
    }

    public List<GaleriaEmpresa> getGaleria() { return galeria; }
    public void setGaleria(List<GaleriaEmpresa> galeria) { 
        this.galeria = galeria; 
    }
}