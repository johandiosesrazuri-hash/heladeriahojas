package com.choccoDelight.repository;

import com.choccoDelight.entity.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DireccionRepository extends JpaRepository<Direccion, Long> {
    List<Direccion> findByUsuarioIdOrderByPrincipalDescIdAsc(Long usuarioId);
}
