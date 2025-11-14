package com.choccoDelight.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.choccoDelight.entity.Contacto;
import com.choccoDelight.repository.ContactoRepository;

@Service
public class ContactoService {

    @Autowired
    private ContactoRepository contactoRepository;

    // Método para guardar un nuevo mensaje de contacto
    public Contacto guardarMensaje(Contacto contacto) {
        return contactoRepository.save(contacto);
    }

    // Método para obtener un contacto por su ID
    public Contacto obtenerPorId(Long id) {
        return contactoRepository.findById(id).orElse(null);  // Devuelve null si no se encuentra el contacto
    }
}
