package com.choccoDelight.repository;

import com.choccoDelight.entity.EstadisticaEmpresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EstadisticaEmpresaRepository extends JpaRepository<EstadisticaEmpresa, Long> {
    List<EstadisticaEmpresa> findByActivoTrueOrderByOrdenAsc();
}