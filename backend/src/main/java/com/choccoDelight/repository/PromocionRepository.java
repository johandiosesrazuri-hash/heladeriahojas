// backend/src/main/java/com/choccoDelight/repository/PromocionRepository.java
package com.choccoDelight.repository;

import com.choccoDelight.entity.Promocion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromocionRepository extends JpaRepository<Promocion, Long> {
    List<Promocion> findByActivoTrue();
}