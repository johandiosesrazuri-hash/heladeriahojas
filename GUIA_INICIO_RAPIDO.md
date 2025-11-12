# 🚀 ChoccoDelight - Guía de Inicio Rápido

## ✅ Estado Actual del Proyecto

Tu proyecto **ChoccoDelight** está completamente funcional con:

- ✅ **Backend**: Spring Boot 3.2.0 corriendo en `http://localhost:8080`
- ✅ **Frontend**: Vite + React corriendo en `http://localhost:5173`
- ✅ **Base de Datos**: MySQL configurada en `localhost:3306`
- ✅ **Autenticación**: JWT implementado y funcional
- ✅ **Seguridad**: CORS, Spring Security, encriptación BCrypt

---

## 🎯 Cómo Acceder a Tu Proyecto

### 1️⃣ Frontend (Interfaz Web)
**URL:** `http://localhost:5173`

**Lo que verás:**
- Página de inicio con navegación
- Menú de helados
- Carrito de compras
- Sistema de autenticación (Login/Register)
- Gestión de pedidos

---

### 2️⃣ Backend (API)
**URL:** `http://localhost:8080`

**Endpoints disponibles:**

#### Autenticación (públicos)
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me (protegido)
```

#### Productos
```
GET    /api/productos
GET    /api/productos/{id}
POST   /api/productos (protegido)
PUT    /api/productos/{id} (protegido)
DELETE /api/productos/{id} (protegido)
```

---

## 🚀 Cómo Ejecutar en Tu Máquina

### Requisitos Previos
- ✅ Java 17+ (tienes Java 24)
- ✅ Maven 3.9+ (tienes 3.9.11)
- ✅ Node.js 16+ (para npm)
- ✅ MySQL 8.0+ (configurado)

### Paso 1: Iniciar MySQL
```bash
# Verificar que MySQL está corriendo
# En Windows: Services (servicios) o línea de comandos
mysql -u root -p

# Ejecutar schema.sql
source C:\Users\JOHAN\Documents\heladeriahojas\heladeriahojas\backend\src\main\resources\schema.sql;
```

### Paso 2: Iniciar Backend
```bash
# Terminal 1 - Backend
cd c:\Users\JOHAN\Documents\heladeriahojas\heladeriahojas\backend

# Opción A: Con JAR (más rápido)
java -jar target/chocco-delight-backend-0.0.1-SNAPSHOT.jar

# Opción B: Con Maven
mvn clean install -DskipTests
mvn spring-boot:run
```

**Verificar:** Backend iniciado cuando ves `Tomcat started on port 8080`

### Paso 3: Iniciar Frontend
```bash
# Terminal 2 - Frontend
cd c:\Users\JOHAN\Documents\heladeriahojas\heladeriahojas\frontend

npm install  # (solo primera vez)
npm run dev
```

**Verificar:** Frontend listo cuando ves `Local: http://localhost:5173`

### Paso 4: Abrir en Navegador
```
http://localhost:5173
```

---

## 🧪 Pruebas Básicas

### Test 1: Registrar Usuario
1. Click en "Registrarse"
2. Completa formulario:
   - Nombre: `Tu Nombre`
   - Email: `tuEmail@example.com`
   - Contraseña: `Password123`
3. Click en "Registrarse"
4. ✅ Deberías estar autenticado y redirigido a inicio

### Test 2: Iniciar Sesión
1. Click en "Cerrar Sesión"
2. Click en "Iniciar Sesión"
3. Ingresa las credenciales del usuario creado
4. ✅ Deberías volver a estar autenticado

### Test 3: Ver Productos
1. Click en "Menú"
2. ✅ Deberías ver lista de productos (si hay en BD)

### Test 4: Agregar al Carrito
1. En la página de Menú
2. Click en "Agregar al Carrito"
3. ✅ El contador en Navbar debería actualizar

### Test 5: Ver Carrito
1. Click en el icono del carrito (🛒)
2. ✅ Deberías ver los items agregados

---

## 📝 Estructura de Archivos Creados

```
📁 heladeriahojas/
├── 📁 backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/choccoDelight/
│           │   ├── ChoccoDelightApplication.java
│           │   ├── controller/
│           │   ├── service/
│           │   ├── entity/
│           │   ├── repository/
│           │   ├── security/
│           │   └── dto/
│           └── resources/
│               ├── application.properties
│               └── schema.sql
│
├── 📁 frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Menu.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Carrito.jsx
│       │   └── Pedido.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── CartContext.jsx
│       ├── styles/
│       │   └── *.scss
│       ├── App.jsx
│       └── main.jsx
│
├── 📄 RESUMEN_PROYECTO.md
├── 📄 BACKEND_DETALLADO.md
├── 📄 FRONTEND_DETALLADO.md
└── 📄 GUIA_INICIO_RAPIDO.md (este archivo)
```

---

## 🔑 Credenciales de Prueba

### Base de Datos MySQL
```
Host:     localhost
Puerto:   3306
Usuario:  root
Contraseña: johandioses1
Base de datos: heladeria_db
```

### JWT
```
Secret: choccoDelightSecretKey2025SuperSecureKeyForTokens
Expiración: 24 horas (86400000 ms)
Algoritmo: HS512
```

---

## 🛠️ Solucionar Problemas

### Error: "Port 8080 already in use"
```bash
# Encontrar proceso en puerto 8080
netstat -ano | findstr :8080

# Matar proceso (reemplaza PID)
taskkill /PID <PID> /F
```

### Error: "Cannot connect to MySQL"
```bash
# Verificar que MySQL está corriendo
# Windows: Services (búsqueda Windows) → MySQL80

# Conectar manualmente
mysql -u root -p
# Ingresa contraseña: johandioses1

# Crear DB si no existe
CREATE DATABASE IF NOT EXISTS heladeria_db;
```

### Error: "Module not found" (Frontend)
```bash
cd frontend
rm -r node_modules
npm install
```

### Backend no inicia
```bash
# Verificar compilación
mvn clean compile

# Ver errores en detalle
mvn clean install -e

# Verificar Java version
java -version
```

---

## 📚 Archivos de Documentación

Tu proyecto incluye 3 documentos detallados:

1. **RESUMEN_PROYECTO.md**
   - Descripción general del proyecto
   - Stack tecnológico
   - Estructura de base de datos
   - Características implementadas

2. **BACKEND_DETALLADO.md**
   - Arquitectura Spring Boot
   - Flujo de autenticación JWT
   - Configuración de seguridad
   - Endpoints REST

3. **FRONTEND_DETALLADO.md**
   - Estructura React y Vite
   - Context API (Auth y Cart)
   - Componentes principales
   - Integración backend-frontend

---

## 🔐 Seguridad Implementada

✅ **Autenticación JWT**
   - Tokens con expiración de 24 horas
   - Validación en cada request protegido

✅ **Encriptación de Contraseñas**
   - BCrypt con salt (no se guarda en texto plano)

✅ **CORS**
   - Solo acepta requests desde `http://localhost:5173`

✅ **Control de Acceso**
   - Endpoints públicos: `/api/auth/**`
   - Endpoints protegidos: Requieren JWT válido

✅ **Stateless API**
   - Sin sesiones en servidor
   - Cada request es independiente

---

## 📈 Próximas Mejoras (Opcionales)

1. **Agregar productos a la BD**
   ```sql
   INSERT INTO productos (nombre, descripcion, precio, imagen, stock_disponible, categoria, activo)
   VALUES ('Chocolate Premium', 'Helado de chocolate oscuro 70%', 5.99, 'https://...', 50, 'Chocolate', true);
   ```

2. **Implementar búsqueda y filtros**
   - Agregar endpoint GET /api/productos?categoria=Chocolate
   - Agregar componente de búsqueda en frontend

3. **Métodos de pago**
   - Integrar Stripe o PayPal
   - Guardar transacciones

4. **Email notifications**
   - Confirmación de pedidos
   - Estado de entrega
   - Recuperación de contraseña

5. **Panel administrativo**
   - CRUD completo de productos
   - Gestión de usuarios
   - Reporte de ventas

6. **Deploy a producción**
   - Backend: Heroku, Azure, AWS
   - Frontend: Vercel, Netlify
   - Base de datos: Cloud (AWS RDS, Azure Database)

---

## 💡 Tips Útiles

### Limpiar caché del navegador
```
Press: F12 → Application → Local Storage → Delete all
```

### Ver requests HTTP (DevTools)
```
F12 → Network → Realizar acción → Ver requests
```

### Ver logs del backend
```
La Terminal 1 mostrará todos los logs de Spring Boot
Busca errores por timestamp
```

### Agregar más productos a la BD
```sql
INSERT INTO productos VALUES 
(NULL, 'Vainilla', 'Clásico helado de vainilla', 4.99, 'url', 100, 'Vainilla', true),
(NULL, 'Fresa', 'Fresco y delicioso', 5.49, 'url', 80, 'Frutas', true),
(NULL, 'Menta', 'Refrescante y suave', 5.99, 'url', 60, 'Menta', true);
```

---

## 📞 Información de Contacto de Componentes

```
Frontend: http://localhost:5173
Backend:  http://localhost:8080
MySQL:    localhost:3306
```

---

## ✨ ¡Tu Proyecto Está Listo!

🎉 **ChoccoDelight** es un proyecto full-stack completamente funcional con:

- ✅ Autenticación de usuarios
- ✅ Gestión de productos
- ✅ Carrito de compras
- ✅ Gestión de pedidos
- ✅ Seguridad JWT
- ✅ Base de datos relacional
- ✅ API REST
- ✅ Frontend moderno

**¡Disfruta tu proyecto!** 🍫🎨

---

**Última actualización: 10 de Noviembre de 2025**
