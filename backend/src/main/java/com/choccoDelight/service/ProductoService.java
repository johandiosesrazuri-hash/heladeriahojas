package com.choccoDelight.service;

import com.choccoDelight.entity.Producto;
import com.choccoDelight.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    @org.springframework.beans.factory.annotation.Autowired
    private ProductoRepository productoRepository;

    public List<Producto> listarProductos() {
        return productoRepository.findByActivoTrue();
    }

    public Producto obtenerProducto(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    public Producto crearProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    public Producto actualizarProducto(Long id, Producto producto) {
        Producto productoExistente = obtenerProducto(id);
        // Copiar campos permitidos al producto existente
        productoExistente.setNombre(producto.getNombre());
        productoExistente.setDescripcion(producto.getDescripcion());
        productoExistente.setPrecio(producto.getPrecio());
        productoExistente.setImagen(producto.getImagen());
        productoExistente.setStockDisponible(producto.getStockDisponible());
        productoExistente.setCategoria(producto.getCategoria());
        productoExistente.setActivo(producto.getActivo());
        return productoRepository.save(productoExistente);
    }

    public void eliminarProducto(Long id) {
        Producto producto = obtenerProducto(id);
        producto.setActivo(false);
        productoRepository.save(producto);
    }
}