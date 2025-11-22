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
    public SobreNosotros crearInformacion(SobreNosotros datos) {
        // Si se marca como activo, desactivar cualquier otro registro activo
        if (Boolean.TRUE.equals(datos.getActivo())) {
            List<SobreNosotros> existentes = sobreNosotrosRepository.findAll();
            for (SobreNosotros registro : existentes) {
                if (Boolean.TRUE.equals(registro.getActivo())) {
                    registro.setActivo(false);
                }
            }
            sobreNosotrosRepository.saveAll(existentes);
        }

        // Forzar nuevo registro
        datos.setId(null);
        if (datos.getActivo() == null) {
            datos.setActivo(true);
        }
        return sobreNosotrosRepository.save(datos);
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
    public ValorEmpresa actualizarValor(Long id, ValorEmpresa valor) {
        ValorEmpresa existente = valorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Valor no encontrado"));

        existente.setIcono(valor.getIcono());
        existente.setTitulo(valor.getTitulo());
        existente.setDescripcion(valor.getDescripcion());
        existente.setOrden(valor.getOrden());
        existente.setActivo(valor.getActivo());
        return valorRepository.save(existente);
    }

    @Transactional
    public EstadisticaEmpresa crearEstadistica(EstadisticaEmpresa estadistica) {
        return estadisticaRepository.save(estadistica);
    }

    @Transactional
    public EstadisticaEmpresa actualizarEstadistica(Long id, EstadisticaEmpresa estadistica) {
        EstadisticaEmpresa existente = estadisticaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estadística no encontrada"));

        existente.setIcono(estadistica.getIcono());
        existente.setValor(estadistica.getValor());
        existente.setDescripcion(estadistica.getDescripcion());
        existente.setOrden(estadistica.getOrden());
        existente.setActivo(estadistica.getActivo());
        return estadisticaRepository.save(existente);
    }

    @Transactional
    public GaleriaEmpresa crearImagenGaleria(GaleriaEmpresa imagen) {
        return galeriaRepository.save(imagen);
    }

    @Transactional
    public GaleriaEmpresa actualizarImagenGaleria(Long id, GaleriaEmpresa imagen) {
        GaleriaEmpresa existente = galeriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Imagen no encontrada"));

        existente.setImagenUrl(imagen.getImagenUrl());
        existente.setTitulo(imagen.getTitulo());
        existente.setDescripcion(imagen.getDescripcion());
        existente.setOrden(imagen.getOrden());
        existente.setActivo(imagen.getActivo());
        return galeriaRepository.save(existente);
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
