# 🍫 ChoccoDelight - Proyecto Full Stack Completado

## 📋 Estructura General del Proyecto

```
heladeriahojas/
├── backend/                    # API REST con Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/com/choccoDelight/
│   │       │   ├── ChoccoDelightApplication.java   # Main
│   │       │   ├── controller/
│   │       │   │   ├── AuthController.java          # Autenticación
│   │       │   │   └── ProductoController.java      # Productos
│   │       │   ├── service/
│   │       │   │   ├── AuthService.java             # Lógica de auth
│   │       │   │   └── ProductoService.java         # Lógica de productos
│   │       │   ├── entity/
│   │       │   │   ├── Usuario.java                 # Modelo Usuario
│   │       │   │   ├── Producto.java                # Modelo Producto
│   │       │   │   ├── Pedido.java                  # Modelo Pedido
│   │       │   │   ├── DetallePedido.java           # Detalles de Pedido
│   │       │   │   └── Delivery.java                # Modelo Delivery
│   │       │   ├── repository/
│   │       │   │   ├── UsuarioRepository.java       # BD Usuarios
│   │       │   │   └── ProductoRepository.java      # BD Productos
│   │       │   ├── security/
│   │       │   │   ├── SecurityConfig.java          # Configuración seguridad
│   │       │   │   ├── JwtTokenUtil.java            # Generación JWT
│   │       │   │   └── JwtRequestFilter.java        # Validación JWT
│   │       │   └── dto/
│   │       │       ├── AuthResponse.java
│   │       │       ├── LoginRequest.java
│   │       │       └── RegisterRequest.java
│   │       └── resources/
│   │           ├── application.properties           # Configuración
│   │           └── schema.sql                       # BD SQL
│   └── pom.xml                                      # Dependencias Maven
│
├── frontend/                   # Frontend Vite + React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                  # Navegación principal
│   │   │   ├── Menu.jsx                    # Listado de productos
│   │   │   ├── Carrito.jsx                 # Carrito de compras
│   │   │   ├── Login.jsx                   # Formulario de login
│   │   │   ├── Register.jsx                # Formulario de registro
│   │   │   └── Pedido.jsx                  # Gestión de pedidos
│   │   ├── context/
│   │   │   ├── AuthContext.jsx             # Contexto de autenticación
│   │   │   └── CartContext.jsx             # Contexto del carrito
│   │   ├── styles/
│   │   │   ├── Navbar.scss
│   │   │   ├── Menu.scss
│   │   │   ├── Login.scss
│   │   │   ├── Register.scss
│   │   │   └── Carrito.scss
│   │   ├── App.jsx                         # Componente principal
│   │   └── main.jsx                        # Entrada principal
│   ├── package.json                        # Dependencias npm
│   ├── vite.config.js                      # Configuración Vite
│   └── index.html                          # HTML principal
│
└── RESUMEN_PROYECTO.md                     # Este archivo

```

---

## 🚀 Tecnologías Utilizadas

### Backend
- **Framework**: Spring Boot 3.2.0
- **Java**: 17+
- **Base de Datos**: MySQL 8.0
- **Seguridad**: Spring Security + JWT
- **Dependencias Clave**:
  - spring-boot-starter-web
  - spring-boot-starter-data-jpa
  - spring-boot-starter-security
  - mysql-connector-java
  - jjwt (JSON Web Tokens)

### Frontend
- **Bundler**: Vite
- **Librería UI**: React 18+
- **Enrutamiento**: React Router
- **HTTP Client**: Axios
- **Estilos**: SCSS
- **Iconos**: Font Awesome

---

## 🔐 Características de Seguridad

### Autenticación JWT
- Tokens con expiración de 24 horas
- Almacenamiento seguro en localStorage
- Validación en cada request protegido

### Control de Acceso
- Endpoints públicos: `/api/auth/login`, `/api/auth/register`
- Endpoints protegidos: `/api/productos`, `/api/pedidos`, `/api/auth/me`
- CORS configurado para `http://localhost:5173`

### Encriptación de Contraseñas
- BCrypt con salt seguro
- No se almacenan contraseñas en texto plano

---

## 📊 Modelos de Base de Datos

### Tabla: usuarios
```sql
- id (PK)
- nombre
- email (UNIQUE)
- password (encriptado)
- rol (USER/ADMIN)
- fecha_creacion
```

### Tabla: productos
```sql
- id (PK)
- nombre
- descripcion
- precio
- imagen
- stock_disponible
- categoria
- activo
```

### Tabla: pedidos
```sql
- id (PK)
- usuario_id (FK)
- fecha
- total
- estado
```

### Tabla: detalle_pedidos
```sql
- id (PK)
- pedido_id (FK)
- producto_id (FK)
- cantidad
- precio_unitario
- subtotal
```

### Tabla: deliveries
```sql
- id (PK)
- pedido_id (FK)
- direccion
- telefono
- fecha_envio
- ciudad
- codigo_postal
- instrucciones_especiales
- nombre_receptor
- estado
```

---

## 🔗 Flujos de API

### Registro de Usuario
```
POST /api/auth/register
Body: { nombre, email, password }
Response: { token, email, nombre, rol }
```

### Login de Usuario
```
POST /api/auth/login
Body: { email, password }
Response: { token, email, nombre, rol }
```

### Obtener Usuario Actual
```
GET /api/auth/me
Headers: Authorization: Bearer {token}
Response: { id, nombre, email, rol }
```

### Listar Productos
```
GET /api/productos
Response: [ { id, nombre, descripcion, precio, imagen, ... } ]
```

---

## 💻 Cómo Ejecutar el Proyecto

### Backend
```bash
cd backend
mvn clean install -DskipTests
java -jar target/chocco-delight-backend-0.0.1-SNAPSHOT.jar
# O con Maven: mvn spring-boot:run
```
Backend disponible en: `http://localhost:8080`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend disponible en: `http://localhost:5173`

### Base de Datos
```sql
-- Crear usuario MySQL (si no existe)
CREATE USER 'root'@'localhost' IDENTIFIED BY 'johandioses1';
GRANT ALL PRIVILEGES ON heladeria_db.* TO 'root'@'localhost';

-- Ejecutar en MySQL
source backend/src/main/resources/schema.sql;
```

---

## 🎨 Componentes Frontend Principales

### Navbar.jsx
- Navegación principal
- Contador de carrito
- Botones de autenticación
- Enlaces a secciones

### Login.jsx / Register.jsx
- Formularios de autenticación
- Validación de datos
- Integración con AuthContext
- Mensajes de error

### Menu.jsx
- Lista de productos
- Carga desde API
- Botón "Agregar al Carrito"
- Carrito actualizado en tiempo real

### Carrito.jsx
- Visualización de items
- Incrementar/decrementar cantidades
- Cálculo de totales
- Botón para procesar pedido

### Pedido.jsx
- Historial de pedidos del usuario
- Estado de entregas
- Información de delivery

---

## 🔧 Configuración Importante

### application.properties (Backend)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/heladeria_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=johandioses1
spring.jpa.hibernate.ddl-auto=update

jwt.secret=choccoDelightSecretKey2025SuperSecureKeyForTokens
jwt.expiration=86400000

server.port=8080
```

### vite.config.js (Frontend)
```javascript
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
}
```

---

## ✅ Estado del Proyecto

- ✅ Backend completamente funcional
- ✅ Autenticación JWT implementada
- ✅ Base de datos MySQL configurada
- ✅ Frontend Vite + React setup
- ✅ Componentes principales creados
- ✅ Contextos de estado (Auth, Cart)
- ✅ Comunicación frontend-backend
- ✅ CORS configurado
- ✅ Seguridad con Spring Security

---

## 🚨 Próximos Pasos (Opcionales)

1. Agregar más productos a la base de datos
2. Implementar búsqueda y filtros en el menú
3. Agregar métodos de pago
4. Implementar notificaciones por email
5. Agregar panel de administración
6. Desplegar en producción (Heroku/Azure/AWS)

---

## 📝 Notas de Desarrollo

- El rol enum se cambió de `ROLE_USER/ROLE_ADMIN` a `USER/ADMIN` para evitar truncamiento en BD
- Los roles se devuelven con prefijo `ROLE_` para mantener compatibilidad con Spring Security
- El proyecto usa Java 24.0.1 (host system)
- Spring Boot 3.2.0 configura automáticamente muchas cosas
- JWT expira después de 24 horas (86400000 ms)

---

**Proyecto CreAdo con ❤️ | ChoccoDelight Heladería 2025**
