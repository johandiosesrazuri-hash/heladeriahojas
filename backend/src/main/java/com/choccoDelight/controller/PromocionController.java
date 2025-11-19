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

   @GetMapping
public ResponseEntity<List<PromocionDTO>> listarPromociones() {
    List<Promocion> promociones = promocionService.listarPromociones();
    List<PromocionDTO> dtos = promociones.stream()
                                         .map(this::convertToDTO)
                                         .collect(Collectors.toList());
    
    // 🔍 AGREGAR LOG TEMPORAL
    System.out.println("📦 Devolviendo " + dtos.size() + " promociones");
    dtos.forEach(dto -> System.out.println("🖼️ ImagenUrl: " + dto.getImagenUrl()));
    
    return ResponseEntity.ok(dtos);
}

private PromocionDTO convertToDTO(Promocion p) {
    PromocionDTO dto = new PromocionDTO();
    dto.setId(p.getId());
    dto.setNombrePromo(p.getNombre());
    dto.setDescripcion(p.getDescripcion());
    
    BigDecimal precio = p.getProducto().getPrecio();
    BigDecimal descuento = BigDecimal.valueOf(p.getDescuento())
                                     .divide(BigDecimal.valueOf(100));
    BigDecimal precioConDescuento = precio.multiply(BigDecimal.ONE.subtract(descuento));
    
    dto.setPrecio(precioConDescuento.doubleValue());
    dto.setDescuento(p.getDescuento());
    
    // 🔍 VERIFICA QUE ESTO NO SEA NULL
    String imagenUrl = p.getImagenUrl();
    System.out.println("🖼️ ImagenUrl de la BD: " + imagenUrl);
    dto.setImagenUrl(imagenUrl != null ? imagenUrl : "/img/promociones/default.png");
    
    return dto;
}

}
