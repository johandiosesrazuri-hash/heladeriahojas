package com.choccoDelight.controller;

import com.choccoDelight.dto.PromocionDTO;
import com.choccoDelight.entity.Promocion;
import com.choccoDelight.service.PromocionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador REST para manejar las promociones.
 */
@RestController
@RequestMapping("/api/promociones")
@CrossOrigin(origins = "http://localhost:5173")
public class PromocionController {

    private final PromocionService promocionService;

    public PromocionController(PromocionService promocionService) {
        this.promocionService = promocionService;
    }

    /**
     * Listar todas las promociones activas.
     */
    @GetMapping
    public ResponseEntity<List<PromocionDTO>> listarPromociones() {
        List<Promocion> promociones = promocionService.listarPromociones();
        List<PromocionDTO> dtos = promociones.stream()
                                             .map(this::convertToDTO)
                                             .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Obtener una promoción por su ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PromocionDTO> obtenerPromocion(@PathVariable Long id) {
        Promocion promo = promocionService.obtenerPorId(id); // ✅ Asegúrate de implementar este método en el service
        if (promo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertToDTO(promo));
    }

   
   private PromocionDTO convertToDTO(Promocion p) {
    PromocionDTO dto = new PromocionDTO();
    dto.setId(p.getId());
    dto.setNombrePromo(p.getNombre());  // Nombre de la promoción
    dto.setDescripcion(p.getDescripcion());
    
    // Cálculo del precio con descuento
    BigDecimal precio = p.getProducto().getPrecio();
    BigDecimal descuento = BigDecimal.valueOf(p.getDescuento())
                                     .divide(BigDecimal.valueOf(100));
    BigDecimal precioConDescuento = precio.multiply(BigDecimal.ONE.subtract(descuento));
    
    dto.setPrecio(precioConDescuento.doubleValue());  // Precio con descuento
    dto.setDescuento(p.getDescuento());  // Descuento
dto.setImagenUrl(p.getImagenUrl()); // Asegúrate de que esta propiedad esté siendo correctamente proporcionada

    return dto;
}




}
