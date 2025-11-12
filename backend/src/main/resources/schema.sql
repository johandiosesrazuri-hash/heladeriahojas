-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS heladeria_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE heladeria_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    fecha_creacion DATETIME NOT NULL
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    imagen VARCHAR(255),
    stock_disponible INT,
    categoria VARCHAR(50),
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    fecha DATETIME NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de detalle de pedidos
CREATE TABLE IF NOT EXISTS detalle_pedidos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla de deliveries
CREATE TABLE IF NOT EXISTS deliveries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    fecha_envio DATETIME,
    ciudad VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10),
    instrucciones_especiales TEXT,
    nombre_receptor VARCHAR(100),
    estado VARCHAR(20) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_delivery_pedido ON deliveries(pedido_id);
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_activo ON productos(activo);