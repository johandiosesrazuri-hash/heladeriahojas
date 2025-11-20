// backend/src/main/java/com/choccoDelight/repository/PromocionProductoRepository.java
package com.choccoDelight.repository;

import com.choccoDelight.entity.PromocionProducto;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromocionProductoRepository extends JpaRepository<PromocionProducto, Long> {
    void deleteByPromocionId(Long promocionId);
}
