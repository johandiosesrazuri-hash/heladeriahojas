package com.choccoDelight.controller;

import com.choccoDelight.dto.CostoDeliveryDTO;
import com.choccoDelight.entity.Delivery;
import com.choccoDelight.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/delivery")
@CrossOrigin(origins = "http://localhost:5173")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @PostMapping
    public ResponseEntity<Delivery> guardarDelivery(@RequestBody Delivery delivery) {
        return ResponseEntity.ok(deliveryService.guardarDelivery(delivery));
    }

    @PostMapping("/calcular-costo")
    public ResponseEntity<CostoDeliveryDTO> calcularCosto(@RequestBody Map<String, Double> coordenadas) {
        Double latitud = coordenadas.get("latitud");
        Double longitud = coordenadas.get("longitud");
        
        CostoDeliveryDTO costo = deliveryService.calcularCostoDelivery(latitud, longitud);
        return ResponseEntity.ok(costo);
    }
}
