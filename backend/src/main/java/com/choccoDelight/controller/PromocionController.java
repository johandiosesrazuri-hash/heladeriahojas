package com.choccoDelight.controller;

import com.choccoDelight.dto.PromocionDTO;
import com.choccoDelight.entity.Promocion;
import com.choccoDelight.service.PromocionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/promociones")
@CrossOrigin(origins = "http://localhost:5173")
public class PromocionController {

    private final PromocionService promocionService;

    public PromocionController(PromocionService promocionService) {
        this.promocionService = promocionService;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PromocionDTO> obtenerPromocion(@PathVariable Long id) {
        Promocion promo = promocionService.obtenerPorId(id); 
        if (promo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertToDTO(promo));
    }

    @GetMapping
    public ResponseEntity<List<PromocionDTO>> listarPromociones() {
            List<Promocion> promociones = promocionService.listarPromociones();
        List<PromocionDTO> dtos = promociones.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<PromocionDTO> crearPromocion(@RequestBody PromocionDTO promocionDTO) {
        Promocion promocion = convertToEntity(promocionDTO);
        Promocion nuevaPromocion = promocionService.crearPromocion(promocion);
        return ResponseEntity.ok(convertToDTO(nuevaPromocion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromocionDTO> actualizarPromocion(@PathVariable Long id, @RequestBody PromocionDTO promocionDTO) {
        Promocion promocion = convertToEntity(promocionDTO);
        Promocion promocionActualizada = promocionService.actualizarPromocion(id, promocion);
        return ResponseEntity.ok(convertToDTO(promocionActualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPromocion(@PathVariable Long id) {
        promocionService.eliminarPromocion(id);
        return ResponseEntity.noContent().build();
    }

    private PromocionDTO convertToDTO(Promocion p) {
        PromocionDTO dto = new PromocionDTO();
        dto.setId(p.getId());
        dto.setNombrePromo(p.getNombre());
        dto.setDescripcion(p.getDescripcion());
        dto.setDescuento(p.getDescuento());
        dto.setImagenUrl(p.getImagenUrl());
        if (p.getPrecioTotal() != null) {
            dto.setPrecioTotal(p.getPrecioTotal().doubleValue());
        }
        
        // Mapear productos
        List<PromocionDTO.ProductoPromoDTO> productosDTO = p.getProductos().stream()
            .map(pp -> {
                PromocionDTO.ProductoPromoDTO prodDTO = new PromocionDTO.ProductoPromoDTO();
                prodDTO.setProductoId(pp.getProducto().getId());
                prodDTO.setNombre(pp.getProducto().getNombre());
                prodDTO.setCantidad(pp.getCantidad());
                if (pp.getPrecioUnitario() != null) {
                    prodDTO.setPrecioUnitario(pp.getPrecioUnitario().doubleValue());
                }
                return prodDTO;
            })
            .collect(Collectors.toList());
        
        dto.setProductos(productosDTO);
        return dto;
    }

    private Promocion convertToEntity(PromocionDTO dto) {
        Promocion promocion = new Promocion();
        promocion.setId(dto.getId());
        promocion.setNombre(dto.getNombrePromo());
        promocion.setDescripcion(dto.getDescripcion());
        promocion.setDescuento(dto.getDescuento());
        promocion.setImagenUrl(dto.getImagenUrl());
        if (dto.getPrecioTotal() != null) {
            promocion.setPrecioTotal(java.math.BigDecimal.valueOf(dto.getPrecioTotal()));
        }
        // La conversión de productos asociados requeriría una lógica más compleja
        return promocion;
    }
}
