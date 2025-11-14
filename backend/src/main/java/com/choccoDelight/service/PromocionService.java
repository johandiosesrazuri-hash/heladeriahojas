package com.choccoDelight.service;

import com.choccoDelight.entity.Promocion;
import com.choccoDelight.repository.PromocionRepository;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PromocionService {

    private final PromocionRepository promocionRepository;

    public PromocionService(PromocionRepository promocionRepository) {
        this.promocionRepository = promocionRepository;
    }

    public List<Promocion> listarPromociones() {
        return promocionRepository.findAll();
    }

    public Promocion obtenerPorId(Long id) {
    return promocionRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Promoción no encontrada con id: " + id));
}

}
