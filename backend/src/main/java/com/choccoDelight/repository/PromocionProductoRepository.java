// backend/src/main/java/com/choccoDelight/repository/PromocionProductoRepository.java
package com.choccoDelight.repository;

import com.choccoDelight.entity.PromocionProducto;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PromocionProductoRepository extends JpaRepository<PromocionProducto, Long> {
    @Modifying
    @Query("DELETE FROM PromocionProducto pp WHERE pp.promocion.id = :promocionId")
    void deleteByPromocionId(@Param("promocionId") Long promocionId);
}
