package com.choccoDelight.controller;

import com.choccoDelight.entity.Delivery;
import com.choccoDelight.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
