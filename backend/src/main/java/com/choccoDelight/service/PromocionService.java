package com.choccoDelight.service;

import com.choccoDelight.dto.PromocionDTO;
import com.choccoDelight.entity.Producto;
import com.choccoDelight.entity.Promocion;
import com.choccoDelight.entity.PromocionProducto;
import com.choccoDelight.repository.ProductoRepository;
import com.choccoDelight.repository.PromocionProductoRepository;
import com.choccoDelight.repository.PromocionRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PromocionService {

    private final PromocionRepository promocionRepository;
    private final ProductoRepository productoRepository;
    private final PromocionProductoRepository promocionProductoRepository;

    public PromocionService(
            PromocionRepository promocionRepository,
            ProductoRepository productoRepository,
            PromocionProductoRepository promocionProductoRepository) {
        this.promocionRepository = promocionRepository;
        this.productoRepository = productoRepository;
        this.promocionProductoRepository = promocionProductoRepository;
    }

    public List<Promocion> listarPromociones() {
        List<Promocion> todas = promocionRepository.findAll();
        LocalDate ahora = LocalDate.now();

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

    @Transactional
    public Promocion crearPromocion(Promocion promocion, List<PromocionDTO.ProductoPromoDTO> productosDTO) {
        // Guardar la promoción primero
        Promocion promocionGuardada = promocionRepository.save(promocion);
        
        // Crear las relaciones con productos
        if (productosDTO != null && !productosDTO.isEmpty()) {
            for (PromocionDTO.ProductoPromoDTO prodDTO : productosDTO) {
                Producto producto = productoRepository.findById(prodDTO.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + prodDTO.getProductoId()));
                
                PromocionProducto pp = new PromocionProducto();
                pp.setPromocion(promocionGuardada);
                pp.setProducto(producto);
                pp.setCantidad(prodDTO.getCantidad() != null ? prodDTO.getCantidad() : 1);
                pp.setPrecioUnitario(producto.getPrecio());
                
                promocionProductoRepository.save(pp);
            }
        }
        
        return promocionRepository.findById(promocionGuardada.getId()).orElse(promocionGuardada);
    }

    @Transactional
    public Promocion actualizarPromocion(Long id, Promocion promocionActualizada, 
                                         List<PromocionDTO.ProductoPromoDTO> productosDTO) {
        Promocion promocionExistente = obtenerPorId(id);
        
        promocionExistente.setNombre(promocionActualizada.getNombre());
        promocionExistente.setDescripcion(promocionActualizada.getDescripcion());
        promocionExistente.setDescuento(promocionActualizada.getDescuento());
        promocionExistente.setPrecioTotal(promocionActualizada.getPrecioTotal());
        promocionExistente.setFechaInicio(promocionActualizada.getFechaInicio());
        promocionExistente.setFechaFin(promocionActualizada.getFechaFin());
        promocionExistente.setActivo(promocionActualizada.getActivo());
        promocionExistente.setImagenUrl(promocionActualizada.getImagenUrl());
        
        // Actualizar productos: eliminar los anteriores y agregar los nuevos
        if (productosDTO != null) {
            // Eliminar productos anteriores
            promocionProductoRepository.deleteByPromocionId(id);
            
            // Agregar los nuevos
            for (PromocionDTO.ProductoPromoDTO prodDTO : productosDTO) {
                Producto producto = productoRepository.findById(prodDTO.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + prodDTO.getProductoId()));
                
                PromocionProducto pp = new PromocionProducto();
                pp.setPromocion(promocionExistente);
                pp.setProducto(producto);
                pp.setCantidad(prodDTO.getCantidad() != null ? prodDTO.getCantidad() : 1);
                pp.setPrecioUnitario(producto.getPrecio());
                
                promocionProductoRepository.save(pp);
            }
        }
        
        return promocionRepository.save(promocionExistente);
    }

    @Transactional
    public void eliminarPromocion(Long id) {
        if (!promocionRepository.existsById(id)) {
            throw new RuntimeException("Promoción no encontrada con id: " + id);
        }
        // Al eliminar la promoción, los PromocionProducto se eliminan automáticamente por cascade
        promocionRepository.deleteById(id);
    }
}