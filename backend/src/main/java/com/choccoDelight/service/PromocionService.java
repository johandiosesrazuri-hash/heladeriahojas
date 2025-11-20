package com.choccoDelight.service;

import com.choccoDelight.entity.Promocion;
import com.choccoDelight.repository.PromocionRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PromocionService {

    private final PromocionRepository promocionRepository;

    public PromocionService(PromocionRepository promocionRepository) {
        this.promocionRepository = promocionRepository;
    }

    public List<Promocion> listarPromociones() {
        List<Promocion> todas = promocionRepository.findAll();
        LocalDateTime ahora = LocalDateTime.now();

        return todas.stream()
            .filter(p -> p.getActivo() != null && p.getActivo())
            .filter(p -> p.getFechaInicio() == null || !ahora.isBefore(p.getFechaInicio()))
            .filter(p -> p.getFechaFin() == null || !ahora.isAfter(p.getFechaFin()))
            .collect(Collectors.toList());
    }

    public Promocion obtenerPorId(Long id) {
        return promocionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Promoción no encontrada con id: " + id));
    }

    public Promocion crearPromocion(Promocion promocion) {
        // Aquí se podría añadir lógica de validación
        return promocionRepository.save(promocion);
    }

    public Promocion actualizarPromocion(Long id, Promocion promocionActualizada) {
        Promocion promocionExistente = obtenerPorId(id);
        
        promocionExistente.setNombre(promocionActualizada.getNombre());
        promocionExistente.setDescripcion(promocionActualizada.getDescripcion());
        promocionExistente.setDescuento(promocionActualizada.getDescuento());
        promocionExistente.setPrecioTotal(promocionActualizada.getPrecioTotal());
        promocionExistente.setFechaInicio(promocionActualizada.getFechaInicio());
        promocionExistente.setFechaFin(promocionActualizada.getFechaFin());
        promocionExistente.setActivo(promocionActualizada.getActivo());
        promocionExistente.setImagenUrl(promocionActualizada.getImagenUrl());
        // La gestión de productos asociados requeriría una lógica más compleja
        
        return promocionRepository.save(promocionExistente);
    }

    public void eliminarPromocion(Long id) {
        if (!promocionRepository.existsById(id)) {
            throw new RuntimeException("Promoción no encontrada con id: " + id);
        }
        promocionRepository.deleteById(id);
    }
}
