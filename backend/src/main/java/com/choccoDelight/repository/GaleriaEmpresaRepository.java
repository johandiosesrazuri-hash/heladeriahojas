package com.choccoDelight.repository;

import com.choccoDelight.entity.GaleriaEmpresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GaleriaEmpresaRepository extends JpaRepository<GaleriaEmpresa, Long> {
    List<GaleriaEmpresa> findByActivoTrueOrderByOrdenAsc();
}