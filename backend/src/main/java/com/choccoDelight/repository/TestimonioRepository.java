package com.choccoDelight.repository;

import com.choccoDelight.entity.Testimonio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestimonioRepository extends JpaRepository<Testimonio, Long> {

    // Método para obtener testimonios de un usuario por su ID
    List<Testimonio> findByUsuario_Id(Long usuarioId);

    // Método para obtener un testimonio por su ID
    Optional<Testimonio> findById(Long id);
}
