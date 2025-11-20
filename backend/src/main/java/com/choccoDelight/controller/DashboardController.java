package com.choccoDelight.controller;

import com.choccoDelight.dto.PedidoDTO;
import com.choccoDelight.dto.PromocionDTO;
import com.choccoDelight.entity.*;
import com.choccoDelight.repository.*;
import com.choccoDelight.service.PromocionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private PromocionProductoRepository promocionProductoRepository;
    @Autowired
    private PedidoRepository pedidoRepository;
    @Autowired
    private ContactoRepository contactoRepository;
    @Autowired
    private PromocionRepository promocionRepository;
    @Autowired
    private PromocionService promocionService;

    // 📊 Estadísticas generales
    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        System.out.println("📊 GET /api/admin/dashboard/stats");

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsuarios", usuarioRepository.count());
        stats.put("totalProductos", productoRepository.count());
        stats.put("totalPedidos", pedidoRepository.count());
        stats.put("ingresosTotales", calcularIngresos());
        stats.put("totalPromociones", promocionRepository.count());

        System.out.println("✅ Stats: " + stats);
        return stats;
    }

    // GESTIÓN DE USUARIOS

    @GetMapping("/usuarios")
    public List<Usuario> obtenerUsuarios() {
        System.out.println("📝 GET /api/admin/dashboard/usuarios");
        List<Usuario> usuarios = usuarioRepository.findAll();
        System.out.println("✅ Usuarios encontrados: " + usuarios.size());
        return usuarios;
    }

    @GetMapping("/usuarios/{id}")
    public Usuario obtenerUsuarioPorId(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @PutMapping("/usuarios/{id}")
    public Usuario actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        Usuario existente = obtenerUsuarioPorId(id);
        existente.setNombre(usuario.getNombre());
        existente.setEmail(usuario.getEmail());
        existente.setRol(usuario.getRol());
        return usuarioRepository.save(existente);
    }

    @DeleteMapping("/usuarios/{id}")
    public Map<String, String> eliminarUsuario(@PathVariable Long id) {
        System.out.println("🗑️ DELETE /api/admin/dashboard/usuarios/" + id);
        usuarioRepository.deleteById(id);
        System.out.println("✅ Usuario eliminado: " + id);
        return Map.of("mensaje", "Usuario eliminado correctamente", "id", id.toString());
    }

    // GESTIÓN DE PRODUCTOS

    @GetMapping("/productos")
    public List<Producto> obtenerProductos() {
        System.out.println("📦 GET /api/admin/dashboard/productos");
        List<Producto> productos = productoRepository.findAll();
        System.out.println("✅ Productos encontrados: " + productos.size());
        for (Producto p : productos) {
            System.out.println("  - ID: " + p.getId() +
                    ", Nombre: " + p.getNombre() +
                    ", Stock: " + p.getStockDisponible() +
                    ", Precio: " + p.getPrecio());
        }
        return productos;
    }

    @GetMapping("/productos/{id}")
    public Producto obtenerProductoPorId(@PathVariable Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    @PostMapping("/productos")
    public Producto crearProducto(@RequestBody Producto producto) {
        System.out.println("➕ POST /api/admin/dashboard/productos - " + producto.getNombre());
        return productoRepository.save(producto);
    }

    @PutMapping("/productos/{id}")
    public Producto actualizarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        Producto existente = obtenerProductoPorId(id);
        existente.setNombre(producto.getNombre());
        existente.setDescripcion(producto.getDescripcion());
        existente.setPrecio(producto.getPrecio());
        existente.setImagen(producto.getImagen());
        existente.setStockDisponible(producto.getStockDisponible());
        existente.setCategoria(producto.getCategoria());
        existente.setActivo(producto.getActivo());
        return productoRepository.save(existente);
    }

    @DeleteMapping("/productos/{id}")
    @Transactional
    public ResponseEntity<Map<String, String>> eliminarProducto(@PathVariable Long id,
            @RequestParam("cantidad") int cantidad) {
        System.out.println(
                "🗑️ DELETE /api/admin/dashboard/productos/" + id + " (Cantidad a eliminar: " + cantidad + ")");
        try {
            // Verificar que existe
            Producto producto = productoRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

            // Verificar si hay suficiente stock para eliminar
            if (producto.getStockDisponible() < cantidad) {
                throw new RuntimeException(
                        "No hay suficiente stock para eliminar. Stock disponible: " + producto.getStockDisponible());
            }

            System.out.println("📦 Eliminando " + cantidad + " unidades del producto: " + producto.getNombre() +
                    " (Stock inicial: " + producto.getStockDisponible() + ")");

            producto.setStockDisponible(producto.getStockDisponible() - cantidad);
            productoRepository.save(producto);

            // Eliminar las promociones asociadas si el stock llega a 0
            if (producto.getStockDisponible() == 0) {
                promocionProductoRepository.deleteById(id);
                System.out.println("🔥 Promociones asociadas eliminadas");
            }

            System.out.println("✅ Producto actualizado correctamente");

            return ResponseEntity.ok(Map.of(
                    "mensaje", "Stock actualizado correctamente",
                    "id", id.toString(),
                    "producto", producto.getNombre(),
                    "stockRestante", String.valueOf(producto.getStockDisponible())));
        } catch (Exception e) {
            System.err.println("❌ Error eliminando producto: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Error al eliminar el producto",
                    "mensaje", e.getMessage()));
        }
    }

    // GESTIÓN DE PEDIDOS

    @GetMapping("/pedidos")
    public List<PedidoDTO> obtenerPedidos() {
        System.out.println("📋 GET /api/admin/dashboard/pedidos");
        List<Pedido> pedidos = pedidoRepository.findAll();
        System.out.println("✅ Pedidos encontrados: " + pedidos.size());

        // Convertir a DTOs para evitar referencias circulares
        return pedidos.stream()
                .map(PedidoDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/pedidos/{id}")
    public PedidoDTO obtenerPedidoPorId(@PathVariable Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        return new PedidoDTO(pedido);
    }

    @PutMapping("/pedidos/{id}/estado")
    public PedidoDTO actualizarEstadoPedido(
            @PathVariable Long id,
            @RequestParam String nuevoEstado) {
        System.out.println("🔄 PUT /api/admin/dashboard/pedidos/" + id + "/estado - " + nuevoEstado);

        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        try {
            pedido.setEstado(Pedido.EstadoPedido.valueOf(nuevoEstado));
            Pedido actualizado = pedidoRepository.save(pedido);
            System.out.println("✅ Estado actualizado a: " + nuevoEstado);
            return new PedidoDTO(actualizado);
        } catch (IllegalArgumentException e) {
            System.out.println("❌ Estado inválido: " + nuevoEstado);
            throw new RuntimeException("Estado de pedido inválido: " + nuevoEstado);
        }
    }
    // GESTIÓN DE CONTACTOS

    @GetMapping("/contactos")
    public List<Contacto> obtenerContactos() {
        System.out.println("📧 GET /api/admin/dashboard/contactos");
        List<Contacto> contactos = contactoRepository.findAll();
        System.out.println("✅ Contactos encontrados: " + contactos.size());
        return contactos;
    }

    @GetMapping("/contactos/{id}")
    public Contacto obtenerContactoPorId(@PathVariable Long id) {
        return contactoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contacto no encontrado"));
    }

    @DeleteMapping("/contactos/{id}")
    public Map<String, String> eliminarContacto(@PathVariable Long id) {
        System.out.println("🗑️ DELETE /api/admin/dashboard/contactos/" + id);
        contactoRepository.deleteById(id);
        System.out.println("✅ Contacto eliminado: " + id);
        return Map.of("mensaje", "Contacto eliminado correctamente", "id", id.toString());
    }

    
    //PROMOCIONES
    @GetMapping("/promociones")
    public List<PromocionDTO> obtenerPromociones() {
        System.out.println("🎁 GET /api/admin/dashboard/promociones");
        List<Promocion> promociones = promocionRepository.findAll();
        System.out.println("✅ Promociones encontradas: " + promociones.size());
        return promociones.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

        @GetMapping("/promociones/{id}")
    public PromocionDTO obtenerPromocionPorId(@PathVariable Long id) {
        Promocion promo = promocionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promoción no encontrada"));
        return convertToDTO(promo);
    }

    @DeleteMapping("/promociones/{id}")
    @Transactional
    public Map<String, String> eliminarPromocion(@PathVariable Long id) {
        System.out.println("🗑️ DELETE /api/admin/dashboard/promociones/" + id);
        promocionProductoRepository.deleteByPromocionId(id);
        promocionRepository.deleteById(id);
        System.out.println("✅ Promoción eliminada: " + id);
        return Map.of("mensaje", "Promoción eliminada correctamente", "id", id.toString());
    }
    
    @PostMapping("/promociones")
    public PromocionDTO crearPromocion(@RequestBody PromocionDTO promocionDTO) {
        System.out.println("➕ POST /api/admin/dashboard/promociones - " + promocionDTO.getNombrePromo());
        Promocion nueva = promocionService.crearPromocion(convertToEntity(promocionDTO), promocionDTO.getProductos());
        return convertToDTO(nueva);
    }

    @PutMapping("/promociones/{id}")
    public PromocionDTO actualizarPromocionCompleta(@PathVariable Long id, @RequestBody PromocionDTO promocionDTO) {
        Promocion actualizada = promocionService.actualizarPromocion(
                id,
                convertToEntity(promocionDTO),
                promocionDTO.getProductos());
        return convertToDTO(actualizada);
    }
    
    // UTILIDADES

    private BigDecimal calcularIngresos() {
        return pedidoRepository.findAll().stream()
                .filter(p -> p.getEstado() == Pedido.EstadoPedido.ENTREGADO)
                .map(Pedido::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Conversión Promocion -> DTO para evitar ciclos al serializar
    private PromocionDTO convertToDTO(Promocion p) {
        PromocionDTO dto = new PromocionDTO();
        dto.setId(p.getId());
        dto.setNombrePromo(p.getNombre());
        dto.setDescripcion(p.getDescripcion());
        dto.setDescuento(p.getDescuento());
        dto.setImagenUrl(p.getImagenUrl());
        dto.setActivo(p.getActivo() != null ? p.getActivo() : true);
        if (p.getFechaInicio() != null) {
            dto.setFechaInicio(p.getFechaInicio());
        }
        if (p.getFechaFin() != null) {
            dto.setFechaFin(p.getFechaFin());
        }
        if (p.getPrecioTotal() != null) {
            dto.setPrecioTotal(p.getPrecioTotal().doubleValue());
        }
        if (p.getProductos() != null) {
            dto.setProductos(
                p.getProductos().stream().map(pp -> {
                    PromocionDTO.ProductoPromoDTO prod = new PromocionDTO.ProductoPromoDTO();
                    prod.setProductoId(pp.getProducto().getId());
                    prod.setNombre(pp.getProducto().getNombre());
                    prod.setCantidad(pp.getCantidad());
                    if (pp.getPrecioUnitario() != null) {
                        prod.setPrecioUnitario(pp.getPrecioUnitario().doubleValue());
                    }
                    return prod;
                }).collect(Collectors.toList())
            );
        }
        return dto;
    }

    private Promocion convertToEntity(PromocionDTO dto) {
        Promocion promocion = new Promocion();
        promocion.setId(dto.getId());
        promocion.setNombre(dto.getNombrePromo());
        promocion.setDescripcion(dto.getDescripcion());
        promocion.setDescuento(dto.getDescuento());
        promocion.setImagenUrl(dto.getImagenUrl());
        promocion.setActivo(dto.getActivo());
        promocion.setFechaInicio(dto.getFechaInicio());
        promocion.setFechaFin(dto.getFechaFin());
        if (dto.getPrecioTotal() != null) {
            promocion.setPrecioTotal(BigDecimal.valueOf(dto.getPrecioTotal()));
        }
        return promocion;
    }
}
