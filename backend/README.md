# Heladería Chocco - Backend

Proyecto Spring Boot (chocco-delight-backend).

Requisitos:
- JDK 17+ (se recomienda Java 21 LTS para producción)
- Maven 3.8+
- MySQL

Base de datos (ejecutar en MySQL) — solo esquema, sin datos:

```sql
CREATE DATABASE heladeria_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE heladeria_db;

CREATE TABLE usuarios (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('CLIENTE', 'ADMIN') DEFAULT 'CLIENTE'
);

CREATE TABLE productos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  imagen VARCHAR(255)
);

CREATE TABLE pedidos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2),
  estado ENUM('PENDIENTE','EN_CAMINO','ENTREGADO') DEFAULT 'PENDIENTE',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE detalles_pedido (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  pedido_id BIGINT NOT NULL,
  producto_id BIGINT NOT NULL,
  cantidad INT DEFAULT 1,
  subtotal DECIMAL(10,2),
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE delivery (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  pedido_id BIGINT NOT NULL,
  direccion VARCHAR(255),
  telefono VARCHAR(20),
  fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);
```

Cómo ejecutar:
1. Configura `src/main/resources/application.properties` con tus credenciales MySQL:

```
spring.datasource.url=jdbc:mysql://localhost:3306/heladeria_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=none
```

2. Compilar y ejecutar:

```bash
mvn clean package
mvn spring-boot:run
```

El backend gira por defecto en http://localhost:8080

Endpoints principales:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/productos
- POST /api/pedidos
- POST /api/delivery
- GET /api/pedidos/usuario/{usuarioId}

Notas:
- JWT y seguridad ya configurados en el proyecto.
- No se insertan datos de ejemplo automáticamente; los productos deben ser creados vía API por un usuario ADMIN o por migraciones externas.

Datos de prueba (opcional)
---------------------------------
Para facilitar pruebas locales puedes activar la carga de datos de desarrollo. Esto insertará un usuario ADMIN (`admin@local` / `admin123`), un usuario CLIENTE (`cliente@local` / `cliente123`) y un par de productos.

Activa la carga estableciendo la propiedad `app.load-sample-data=true` al iniciar la app. Ejemplo (PowerShell):

```powershell
cd .\backend
mvn spring-boot:run -Dapp.load-sample-data=true
```

Si prefieres usar `java -jar`:

```powershell
mvn -f .\backend -DskipTests package
java -jar .\backend\target\chocco-delight-backend-0.0.1-SNAPSHOT.jar --app.load-sample-data=true
```

Esto es opcional y solo útil en desarrollo local; no afecta producción si no se activa la propiedad.
