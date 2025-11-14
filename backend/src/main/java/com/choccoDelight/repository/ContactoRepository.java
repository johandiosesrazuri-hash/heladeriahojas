package com.choccoDelight.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.choccoDelight.entity.Contacto;

@Repository
public interface ContactoRepository extends JpaRepository<Contacto, Long> {
    // El método debe devolver Optional<Contacto>
    Optional<Contacto> findById(Long id);  // Usar Optional para que sea compatible con CrudRepository
}
