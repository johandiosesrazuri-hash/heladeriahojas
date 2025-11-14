package com.choccoDelight.controller;

import com.choccoDelight.entity.Contacto;
import com.choccoDelight.service.ContactoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contacto")
@CrossOrigin(origins = "http://localhost:5173") // Permitir acceso desde el frontend
public class ContactoController {

    @Autowired
    private ContactoService contactoService;

    // Endpoint para guardar los datos del formulario de contacto
    @PostMapping
    public ResponseEntity<Contacto> guardarMensaje(@RequestBody Contacto contacto) {
        Contacto mensajeGuardado = contactoService.guardarMensaje(contacto);
        return ResponseEntity.ok(mensajeGuardado); // Retorna el contacto guardado
    }

    // Endpoint para obtener un contacto por su ID
    @GetMapping("/{id}")
    public ResponseEntity<Contacto> obtenerContacto(@PathVariable Long id) {
        Contacto contacto = contactoService.obtenerPorId(id);
        if (contacto == null) {
            return ResponseEntity.notFound().build();  // Retorna 404 si no se encuentra
        }
        return ResponseEntity.ok(contacto);  // Retorna el contacto con un 200 OK
    }
}
