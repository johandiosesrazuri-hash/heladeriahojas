package com.choccoDelight.controller;

import com.choccoDelight.entity.*;
import com.choccoDelight.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class DashboardController {

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private ProductoRepository productoRepository;
    @Autowired private PedidoRepository pedidoRepository;
    @Autowired private ContactoRepository contactoRepository;

    // 📊 Estadísticas generales
    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsuarios", usuarioRepository.count());
        stats.put("totalProductos", productoRepository.count());
        stats.put("totalPedidos", pedidoRepository.count());
        stats.put("ingresosTotales", calcularIngresos());
        return stats;
    }

    // 👥 Gestión de Usuarios
    @GetMapping("/usuarios")
    public List<Usuario> obtenerUsuarios() {
        return usuarioRepository.findAll();
    }

    @DeleteMapping("/usuarios/{id}")
    public void eliminarUsuario(@PathVariable Long id) {
        usuarioRepository.deleteById(id);
    }

    // 🍦 Gestión de Productos
    @GetMapping("/productos")
    public List<Producto> obtenerProductos() {
        return productoRepository.findAll();
    }

    @PostMapping("/productos")
    public Producto crearProducto(@RequestBody Producto producto) {
        return productoRepository.save(producto);
    }

    @PutMapping("/productos/{id}")
    public Producto actualizarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        producto.setId(id);
        return productoRepository.save(producto);
    }

    @DeleteMapping("/productos/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        productoRepository.deleteById(id);
    }

    // 📦 Gestión de Pedidos
    @GetMapping("/pedidos")
    public List<Pedido> obtenerPedidos() {
        return pedidoRepository.findAll();
    }

    @PutMapping("/pedidos/{id}/estado")
    public Pedido actualizarEstadoPedido(
            @PathVariable Long id,
            @RequestParam String nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        pedido.setEstado(Pedido.EstadoPedido.valueOf(nuevoEstado));
        return pedidoRepository.save(pedido);
    }

    // 📧 Gestión de Contactos
    @GetMapping("/contactos")
    public List<Contacto> obtenerContactos() {
        return contactoRepository.findAll();
    }

    @DeleteMapping("/contactos/{id}")
    public void eliminarContacto(@PathVariable Long id) {
        contactoRepository.deleteById(id);
    }

    // 📊 Ingresos totales
    private BigDecimal calcularIngresos() {
        return pedidoRepository.findAll().stream()
                .filter(p -> p.getEstado() == Pedido.EstadoPedido.ENTREGADO)
                .map(Pedido::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}