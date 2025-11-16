package com.choccoDelight.repository;

import com.choccoDelight.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SobreNosotrosRepository extends JpaRepository<SobreNosotros, Long> {
    Optional<SobreNosotros> findFirstByActivoTrue();
}
