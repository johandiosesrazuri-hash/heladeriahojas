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

import java.math.BigDecimal;
import java.math.RoundingMode;
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

        calcularYActualizarPrecioTotal(promocionGuardada.getId());

        return promocionRepository.findById(promocionGuardada.getId()).orElse(promocionGuardada);
    }

    @Transactional
    public Promocion actualizarPromocion(Long id, Promocion promocionActualizada,
            List<PromocionDTO.ProductoPromoDTO> productosDTO) {
        Promocion promocionExistente = obtenerPorId(id);

        promocionExistente.setNombre(promocionActualizada.getNombre());
        promocionExistente.setDescripcion(promocionActualizada.getDescripcion());
        promocionExistente.setDescuento(promocionActualizada.getDescuento());
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

        promocionRepository.save(promocionExistente);

        calcularYActualizarPrecioTotal(id);

        return promocionRepository.findById(id).orElse(promocionExistente);
    }

    @Transactional
    public void eliminarPromocion(Long id) {
        if (!promocionRepository.existsById(id)) {
            throw new RuntimeException("Promoción no encontrada con id: " + id);
        }
        // Al eliminar la promoción, los PromocionProducto se eliminan automáticamente
        // por cascade
        promocionRepository.deleteById(id);
    }

    private void calcularYActualizarPrecioTotal(Long promocionId) {
        Promocion promocion = promocionRepository.findById(promocionId)
                .orElseThrow(() -> new RuntimeException("Promoción no encontrada con id: " + promocionId));

        // Obtener todos los productos de la promoción
        List<PromocionProducto> productos = promocion.getProductos();

        if (productos == null || productos.isEmpty()) {
            // Si no hay productos, el precio total es 0
            promocion.setPrecioTotal(BigDecimal.ZERO);
            promocionRepository.save(promocion);
            return;
        }

        // Calcular la suma total de los productos (precio × cantidad)
        BigDecimal sumaTotal = BigDecimal.ZERO;

        for (PromocionProducto pp : productos) {
            BigDecimal precioUnitario = pp.getPrecioUnitario();
            Integer cantidad = pp.getCantidad();

            if (precioUnitario != null && cantidad != null) {
                BigDecimal subtotal = precioUnitario.multiply(BigDecimal.valueOf(cantidad));
                sumaTotal = sumaTotal.add(subtotal);
            }
        }

        // Aplicar el descuento
        Double descuento = promocion.getDescuento();
        BigDecimal precioFinal;

        if (descuento != null && descuento > 0) {
            // Calcular el factor de descuento: (1 - descuento/100)
            BigDecimal factorDescuento = BigDecimal.ONE.subtract(
                    BigDecimal.valueOf(descuento).divide(
                            BigDecimal.valueOf(100),
                            4, // 4 decimales de precisión
                            RoundingMode.HALF_UP));

            // Aplicar el descuento
            precioFinal = sumaTotal.multiply(factorDescuento).setScale(2, RoundingMode.HALF_UP);
        } else {
            // Sin descuento
            precioFinal = sumaTotal.setScale(2, RoundingMode.HALF_UP);
        }

        // Actualizar el precio total en la promoción
        promocion.setPrecioTotal(precioFinal);
        promocionRepository.save(promocion);
    }
}