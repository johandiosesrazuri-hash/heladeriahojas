package com.choccoDelight.repository;

import com.choccoDelight.entity.PasswordResetToken;
import com.choccoDelight.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);

    void deleteByUsuario(Usuario usuario);
}
