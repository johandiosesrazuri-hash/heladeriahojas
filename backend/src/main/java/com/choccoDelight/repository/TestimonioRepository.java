package com.choccoDelight.repository;

import com.choccoDelight.entity.Testimonio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestimonioRepository extends JpaRepository<Testimonio, Long> {
    List<Testimonio> findByUsuarioIdOrderByFechaDesc(Long usuarioId);
    Optional<Testimonio> findByUsuarioId(Long usuarioId);
}