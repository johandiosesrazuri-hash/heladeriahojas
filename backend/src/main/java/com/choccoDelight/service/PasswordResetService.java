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

        // Check if token exists for user
        Optional<PasswordResetToken> existingToken = tokenRepository.findByUsuario(user);

        String token = UUID.randomUUID().toString();
        PasswordResetToken myToken;

        if (existingToken.isPresent()) {
            myToken = existingToken.get();
            myToken.setToken(token);
            myToken.setExpiryDate(LocalDateTime.now().plusMinutes(10));
            myToken.setUsed(false);
        } else {
            myToken = new PasswordResetToken(token, user, LocalDateTime.now().plusMinutes(10));
        }

        tokenRepository.save(myToken);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        String message = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9fafb;\">"
                +
                "<div style=\"text-align: center; margin-bottom: 20px;\">" +
                "<h2 style=\"color: #4F46E5; margin: 0;\">ChoccoDelight</h2>" +
                "</div>" +
                "<div style=\"background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);\">"
                +
                "<h3 style=\"color: #111827; margin-top: 0;\">Restablecer Contraseña</h3>" +
                "<p style=\"color: #4B5563; line-height: 1.6;\">Hola <strong>" + user.getNombre() + "</strong>,</p>" +
                "<p style=\"color: #4B5563; line-height: 1.6;\">Has solicitado restablecer tu contraseña. Para continuar, haz clic en el siguiente botón:</p>"
                +
                "<div style=\"text-align: center; margin: 30px 0;\">" +
                "<a href=\"" + resetLink
                + "\" style=\"background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);\">Restablecer aquí</a>"
                +
                "</div>" +
                "<p style=\"color: #4B5563; line-height: 1.6;\">Este enlace expirará en 10 minutos.</p>" +
                "<p style=\"color: #6B7280; font-size: 14px; margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 20px;\">Si no solicitaste este cambio, puedes ignorar este mensaje de forma segura.</p>"
                +
                "</div>" +
                "<div style=\"text-align: center; margin-top: 20px; color: #9CA3AF; font-size: 12px;\">" +
                "<p>&copy; 2025 ChoccoDelight. Todos los derechos reservados.</p>" +
                "</div>" +
                "</div>";

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
