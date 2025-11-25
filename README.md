# 🍦 ChoccoDelight - Sistema de Heladería

Sistema completo de gestión de heladería con backend Spring Boot y frontend React.

## 🚀 Inicio Rápido

**Requisitos:**
- Java 21
- Node.js 20+
- MySQL 8.0

### 1. Configurar Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

El backend estará disponible en: `http://localhost:8080`

### 2. Configurar Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

### 3. Acceder a Swagger UI

Documentación interactiva de la API: `http://localhost:8080/swagger-ui.html`

## 📚 Documentación

Ver [MEJORAS_IMPLEMENTADAS.md](./MEJORAS_IMPLEMENTADAS.md) para documentación completa de:
- ✅ Sistema de refresh tokens
- ✅ Manejo global de excepciones
- ✅ Headers de seguridad
- ✅ Swagger/OpenAPI
- ✅ Paginación
- ✅ Interceptor Axios
- ✅ Sistema Toast
- ✅ CI/CD con GitHub Actions

## 🔑 Credenciales por Defecto

**Admin:**
- Email: admin@choccodelight.com
- Password: (configurado en DevDataLoader)

## 🛠️ Comandos Útiles

```bash
# Backend: compilar
cd backend
mvn clean install

# Backend: ejecutar tests
mvn test

# Backend: ejecutar aplicación
mvn spring-boot:run

# Frontend: instalar dependencias
cd frontend
npm install

# Frontend: ejecutar en desarrollo
npm run dev

# Frontend: ejecutar lint
npm run lint

# Frontend: build de producción
npm run build
```

## 🌐 Endpoints Principales

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/refresh` - Refresh token
- `GET /api/productos` - Listar productos
- `GET /api/productos/paginated` - Productos paginados
- `POST /api/pedidos` - Crear pedido

Ver documentación completa en Swagger UI.

## 🔒 Seguridad

- Tokens JWT con refresh automático (15min + 7 días)
- Headers de seguridad HTTP configurados
- Validación en backend y frontend
- Passwords encriptados con BCrypt

## 📦 Stack Tecnológico

**Backend:**
- Spring Boot 3.2.0
- Spring Security + JWT
- MySQL 8.0
- Maven

**Frontend:**
- React 19
**DevOps:**
- GitHub Actionsind CSS

**DevOps:**
- GitHub Actions

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y de uso exclusivo de ChoccoDelight.

---

**Desarrollado con ❤️ por el equipo ChoccoDelight**
