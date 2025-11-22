package com.choccoDelight.service;

import com.choccoDelight.dto.PerfilDTO;
import com.choccoDelight.entity.*;
import com.choccoDelight.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PerfilService {

    private final UsuarioRepository usuarioRepository;
    private final DireccionRepository direccionRepository;
    private final PedidoRepository pedidoRepository;
    private final TestimonioRepository testimonioRepository;
    private final PasswordEncoder passwordEncoder;

    public PerfilService(UsuarioRepository usuarioRepository,
            DireccionRepository direccionRepository,
            PedidoRepository pedidoRepository,
            TestimonioRepository testimonioRepository,
            PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.direccionRepository = direccionRepository;
        this.pedidoRepository = pedidoRepository;
        this.testimonioRepository = testimonioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public PerfilDTO obtenerPerfil(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Direccion> direcciones = direccionRepository.findByUsuarioIdOrderByPrincipalDescIdAsc(usuario.getId());
        List<Pedido> pedidos = pedidoRepository.findByUsuarioIdOrderByFechaDesc(usuario.getId());
        List<Testimonio> testimonios = testimonioRepository.findByUsuarioIdOrderByFechaDesc(usuario.getId());

        return new PerfilDTO(usuario, direcciones, pedidos, testimonios);
    }

    @Transactional
    public Usuario actualizarPerfil(String email, Usuario cambios) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setNombre(cambios.getNombre());
        usuario.setTelefono(cambios.getTelefono());
        usuario.setAvatarUrl(cambios.getAvatarUrl());

        // Validar y actualizar email si cambió
        if (cambios.getEmail() != null && !cambios.getEmail().equals(usuario.getEmail())) {
            if (usuarioRepository.existsByEmail(cambios.getEmail())) {
                throw new RuntimeException("El correo electrónico ya está en uso por otro usuario");
            }
            usuario.setEmail(cambios.getEmail());
        }

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void cambiarPassword(String email, String passwordActual, String nuevaPassword) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!passwordEncoder.matches(passwordActual, usuario.getPassword())) {
            throw new RuntimeException("La contraseña actual no es correcta");
        }
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);
    }

    @Transactional
    public Direccion crearDireccion(String email, Direccion dir) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        dir.setId(null);
        dir.setUsuario(usuario);
        if (Boolean.TRUE.equals(dir.getPrincipal())) {
            limpiarPrincipal(usuario.getId());
        }
        return direccionRepository.save(dir);
    }

    @Transactional
    public Direccion actualizarDireccion(String email, Long id, Direccion dir) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Direccion existente = direccionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada"));
        if (!existente.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("No puedes modificar esta dirección");
        }
        existente.setAlias(dir.getAlias());
        existente.setLinea1(dir.getLinea1());
        existente.setLinea2(dir.getLinea2());
        existente.setCiudad(dir.getCiudad());
        existente.setRegion(dir.getRegion());
        existente.setCp(dir.getCp());
        existente.setReferencias(dir.getReferencias());
        existente.setPrincipal(dir.getPrincipal());
        existente.setActivo(dir.getActivo());
        if (Boolean.TRUE.equals(dir.getPrincipal())) {
            limpiarPrincipal(usuario.getId());
            existente.setPrincipal(true);
        }
        return direccionRepository.save(existente);
    }

    @Transactional
    public void eliminarDireccion(String email, Long id) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Direccion existente = direccionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada"));
        if (!existente.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("No puedes eliminar esta dirección");
        }
        direccionRepository.delete(existente);
    }

    @Transactional
    public Testimonio crearTestimonio(String email, Testimonio testimonio) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        testimonio.setId(null);
        testimonio.setUsuario(usuario);
        return testimonioRepository.save(testimonio);
    }

    @Transactional
    public Testimonio actualizarTestimonio(String email, Long id, Testimonio testimonio) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Testimonio existente = testimonioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Testimonio no encontrado"));
        if (!existente.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("No puedes editar este testimonio");
        }
        existente.setCalificacion(testimonio.getCalificacion());
        existente.setComentario(testimonio.getComentario());
        return testimonioRepository.save(existente);
    }

    @Transactional
    public void eliminarTestimonio(String email, Long id) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Testimonio existente = testimonioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Testimonio no encontrado"));
        if (!existente.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("No puedes eliminar este testimonio");
        }
        testimonioRepository.delete(existente);
    }

    private void limpiarPrincipal(Long usuarioId) {
        List<Direccion> dirs = direccionRepository.findByUsuarioIdOrderByPrincipalDescIdAsc(usuarioId);
        for (Direccion d : dirs) {
            if (Boolean.TRUE.equals(d.getPrincipal())) {
                d.setPrincipal(false);
            }
        }
        direccionRepository.saveAll(dirs);
    }
}
