package com.choccoDelight.service;

import com.choccoDelight.entity.PasswordResetToken;
import com.choccoDelight.entity.Usuario;
import com.choccoDelight.repository.PasswordResetTokenRepository;
import com.choccoDelight.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public void createPasswordResetTokenForUser(String email) {
        Optional<Usuario> userOptional = usuarioRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            // Don't reveal if user exists or not
            return;
        }
        Usuario user = userOptional.get();

        // Delete existing token if any
        tokenRepository.deleteByUsuario(user);

        String token = UUID.randomUUID().toString();
        PasswordResetToken myToken = new PasswordResetToken(token, user, LocalDateTime.now().plusMinutes(10));
        tokenRepository.save(myToken);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        String message = "Hola " + user.getNombre() + ",\n\n" +
                "Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:\n" +
                resetLink + "\n\n" +
                "Este enlace expira en 10 minutos.\n" +
                "Si no solicitaste esto, ignora este mensaje.";

        emailService.sendEmail(user.getEmail(), "Restablecer Contraseña - ChoccoDelight", message);
    }

    public boolean validatePasswordResetToken(String token) {
        Optional<PasswordResetToken> passToken = tokenRepository.findByToken(token);
        return passToken.isPresent() && !passToken.get().isExpired() && !passToken.get().getUsed();
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> passTokenOptional = tokenRepository.findByToken(token);
        if (passTokenOptional.isPresent()) {
            PasswordResetToken passToken = passTokenOptional.get();
            if (!passToken.isExpired() && !passToken.getUsed()) {
                Usuario user = passToken.getUsuario();
                user.setPassword(passwordEncoder.encode(newPassword));
                usuarioRepository.save(user);

                passToken.setUsed(true);
                tokenRepository.save(passToken);
            }
        }
    }
}
