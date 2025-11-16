package com.choccoDelight.repository;

import com.choccoDelight.entity.ValorEmpresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ValorEmpresaRepository extends JpaRepository<ValorEmpresa, Long> {
    List<ValorEmpresa> findByActivoTrueOrderByOrdenAsc();
}