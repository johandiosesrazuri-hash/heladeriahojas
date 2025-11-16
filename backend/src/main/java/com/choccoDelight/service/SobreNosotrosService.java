package com.choccoDelight.service;

import com.choccoDelight.dto.SobreNosotrosDTO;
import com.choccoDelight.entity.*;
import com.choccoDelight.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class SobreNosotrosService {

    private final SobreNosotrosRepository sobreNosotrosRepository;
    private final ValorEmpresaRepository valorRepository;
    private final EstadisticaEmpresaRepository estadisticaRepository;
    private final GaleriaEmpresaRepository galeriaRepository;

    public SobreNosotrosService(
            SobreNosotrosRepository sobreNosotrosRepository,
            ValorEmpresaRepository valorRepository,
            EstadisticaEmpresaRepository estadisticaRepository,
            GaleriaEmpresaRepository galeriaRepository) {
        this.sobreNosotrosRepository = sobreNosotrosRepository;
        this.valorRepository = valorRepository;
        this.estadisticaRepository = estadisticaRepository;
        this.galeriaRepository = galeriaRepository;
    }

    @Transactional(readOnly = true)
    public SobreNosotrosDTO obtenerInformacionCompleta() {
        SobreNosotros info = sobreNosotrosRepository.findFirstByActivoTrue()
                .orElseThrow(() -> new RuntimeException("No hay información disponible"));

        List<ValorEmpresa> valores = valorRepository.findByActivoTrueOrderByOrdenAsc();
        List<EstadisticaEmpresa> estadisticas = estadisticaRepository
                .findByActivoTrueOrderByOrdenAsc();
        List<GaleriaEmpresa> galeria = galeriaRepository
                .findByActivoTrueOrderByOrdenAsc();

        return new SobreNosotrosDTO(info, valores, estadisticas, galeria);
    }

    @Transactional
    public SobreNosotros actualizarInformacion(Long id, SobreNosotros datos) {
        SobreNosotros existente = sobreNosotrosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Información no encontrada"));

        existente.setTitulo(datos.getTitulo());
        existente.setSubtitulo(datos.getSubtitulo());
        existente.setDescripcionPrincipal(datos.getDescripcionPrincipal());
        existente.setMision(datos.getMision());
        existente.setVision(datos.getVision());
        existente.setVideoUrl(datos.getVideoUrl());
        existente.setImagenPrincipal(datos.getImagenPrincipal());
        existente.setActivo(datos.getActivo());

        return sobreNosotrosRepository.save(existente);
    }

    @Transactional
    public ValorEmpresa crearValor(ValorEmpresa valor) {
        return valorRepository.save(valor);
    }

    @Transactional
    public EstadisticaEmpresa crearEstadistica(EstadisticaEmpresa estadistica) {
        return estadisticaRepository.save(estadistica);
    }

    @Transactional
    public GaleriaEmpresa crearImagenGaleria(GaleriaEmpresa imagen) {
        return galeriaRepository.save(imagen);
    }

    @Transactional
    public void eliminarValor(Long id) {
        valorRepository.deleteById(id);
    }

    @Transactional
    public void eliminarEstadistica(Long id) {
        estadisticaRepository.deleteById(id);
    }

    @Transactional
    public void eliminarImagenGaleria(Long id) {
        galeriaRepository.deleteById(id);
    }
}