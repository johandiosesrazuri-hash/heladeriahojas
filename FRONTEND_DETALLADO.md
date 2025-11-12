# ⚛️ ChoccoDelight - Estructura Frontend Detallada

## 🎯 Stack Frontend

```
Vite 7.1.14 (Bundler de aplicaciones)
├── React 18+ (Librería UI)
├── React Router (Enrutamiento)
├── Axios (HTTP Client)
├── SCSS (Estilos)
└── Font Awesome (Iconos)
```

---

## 🗂️ Estructura de Carpetas

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          ← Navegación principal
│   │   ├── Menu.jsx            ← Listado de productos
│   │   ├── Carrito.jsx         ← Carrito de compras
│   │   ├── Login.jsx           ← Formulario login
│   │   ├── Register.jsx        ← Formulario registro
│   │   └── Pedido.jsx          ← Gestión pedidos
│   │
│   ├── context/
│   │   ├── AuthContext.jsx     ← Autenticación global
│   │   └── CartContext.jsx     ← Carrito global
│   │
│   ├── styles/
│   │   ├── Navbar.scss
│   │   ├── Menu.scss
│   │   ├── Login.scss
│   │   ├── Register.scss
│   │   └── Carrito.scss
│   │
│   ├── App.jsx                 ← Componente raíz
│   ├── App.css
│   ├── main.jsx                ← Entrada
│   └── index.css               ← Estilos globales
│
├── public/                      ← Recursos estáticos
├── index.html                   ← HTML principal
├── package.json                 ← Dependencias
├── vite.config.js              ← Config Vite
└── eslint.config.js            ← Config ESLint
```

---

## 🔐 Context API - Autenticación

### AuthContext.jsx
```jsx
// Estados globales
├── user: { id, nombre, email, rol }
├── token: JWT token
│
// Funciones
├── login(email, password)
│   └── POST /api/auth/login → Obtiene token
│
├── register(userData)
│   └── POST /api/auth/register → Crea usuario
│
├── logout()
│   └── Limpia localStorage y estado
│
└── checkAuth()
    └── GET /api/auth/me → Verifica sesión actual
```

**Uso en componentes:**
```jsx
const { user, token, login, logout } = useAuth();
```

### CartContext.jsx
```jsx
// Estados globales
├── items: [ { id, name, price, quantity, image } ]
│
// Funciones
├── addItem(item)
│   └── Agrega o incrementa cantidad
│
├── removeItem(itemId)
│   └── Elimina del carrito
│
├── updateQuantity(itemId, quantity)
│   └── Cambia cantidad
│
├── clearCart()
│   └── Vacía carrito
│
└── getTotalPrice()
    └── Calcula total
```

**Uso en componentes:**
```jsx
const { items, addItem, removeItem } = useCart();
```

---

## 📄 Componentes Principales

### 1. Navbar.jsx
**Función:** Navegación principal del sitio

```jsx
Elementos:
├── Logo ChoccoDelight
├── Menu de navegación
│   ├── Inicio
│   ├── Menú
│   ├── Promociones
│   └── Contacto
│
└── Acciones
    ├── Carrito (con contador)
    ├── Mis Pedidos (si autenticado)
    ├── Iniciar Sesión / Registrarse (si NO autenticado)
    └── Cerrar Sesión (si autenticado)
```

**Integración:**
- Lee `user` de AuthContext
- Lee `items` de CartContext
- Integración con React Router para navegación

---

### 2. Menu.jsx
**Función:** Mostrar lista de productos disponibles

```jsx
Flujo:
1. useEffect → Llama GET /api/productos
2. Mapea productos en grid
3. Cada producto muestra:
   ├── Imagen
   ├── Nombre
   ├── Descripción
   ├── Precio
   └── Botón "Agregar al Carrito"

4. Click en botón → addItem(CartContext)
5. Actualiza contador en Navbar automáticamente
```

**Estructura item:**
```jsx
{
  id: 1,
  nombre: "Chocolate Premium",
  descripcion: "Helado de chocolate oscuro 70%",
  precio: 5.99,
  imagen: "https://...",
  stock_disponible: 50,
  categoria: "Chocolate"
}
```

---

### 3. Carrito.jsx
**Función:** Gestionar y visualizar carrito de compras

```jsx
Componentes:
├── Lista de items
│   ├── Imagen
│   ├── Nombre
│   ├── Precio unitario
│   ├── Cantidad (con botones +/-)
│   └── Subtotal (precio × cantidad)
│
├── Resumen
│   ├── Subtotal
│   ├── Impuestos
│   ├── Total
│   └── Botón "Procesar Pedido"
│
└── Carrito vacío (si no hay items)
    └── Enlace a Menú
```

**Funcionalidades:**
- Incrementar/decrementar cantidad
- Eliminar item
- Cálculo automático de totales
- Validación: Solo usuarios autenticados pueden comprar

---

### 4. Login.jsx
**Función:** Formulario para iniciar sesión

```jsx
Formulario:
├── Campo Email
├── Campo Contraseña
├── Botón "Iniciar Sesión"
└── Enlace "¿No tienes cuenta?" → Register

Proceso:
1. Usuario ingresa credenciales
2. Submit → Llamar authContext.login()
3. Si éxito:
   ├── Token guardado en localStorage
   ├── Usuario guardado en estado
   ├── Redirige a "/"
   └── Navbar se actualiza automáticamente
4. Si error:
   └── Muestra mensaje de error
```

**Validaciones:**
- Email válido
- Contraseña no vacía
- Integración con AuthContext

---

### 5. Register.jsx
**Función:** Formulario para crear nueva cuenta

```jsx
Formulario:
├── Campo Nombre
├── Campo Email
├── Campo Contraseña
├── Campo Confirmar Contraseña
├── Botón "Registrarse"
└── Enlace "¿Ya tienes cuenta?" → Login

Proceso:
1. Usuario completa formulario
2. Validaciones:
   ├── Contraseñas deben coincidir
   ├── Email formato válido
   └── Campos no vacíos
3. Submit → Llamar authContext.register()
4. Si éxito:
   ├── Usuario creado en BD
   ├── Token obtenido automáticamente
   ├── Estado actualizado
   └── Redirige a "/"
5. Si error:
   └── Muestra mensaje de error
```

---

### 6. Pedido.jsx
**Función:** Visualizar historial y estado de pedidos

```jsx
Funcionalidades:
├── Cargar pedidos del usuario autenticado
│   └── GET /api/pedidos (con JWT)
│
├── Mostrar lista de pedidos
│   ├── ID del pedido
│   ├── Fecha
│   ├── Total
│   ├── Estado (Pendiente, Enviando, Entregado)
│   └── Información de delivery
│
└── Detalles por pedido
    ├── Items comprados
    ├── Dirección de entrega
    ├── Teléfono de contacto
    └── Fecha estimada de entrega
```

**Seguridad:**
- Solo accesible con autenticación
- Valida JWT en cada request
- Muestra solo pedidos del usuario autenticado

---

## 🔄 Flujo de Autenticación en Frontend

```
PÁGINA INICIAL
       ↓
   Cargar App.jsx
       ↓
   AuthProvider carga token de localStorage
       ↓
   ¿Token existe?
   ├─ SÍ → Llamar checkAuth() (validar con backend)
   │   ├─ Válido → Setear user
   │   └─ Inválido → Limpiar token, mostrar login
   └─ NO → Usuario sin autenticación

Usuario NO autenticado:
├─ Ve Menu, Navbar con Login/Register
└─ No puede acceder a Pedidos, Carrito checkout

Usuario autenticado:
├─ Ve Menu, Navbar con Mis Pedidos, Logout
├─ Puede agregar al carrito
├─ Puede ver Pedidos
└─ Puede hacer checkout
```

---

## 🌐 Comunicación Backend-Frontend

### Axios Configuration
```jsx
// Base URL automático (proxy en vite.config.js)
axios.post('/api/auth/login', data)
// Resuelve a: http://localhost:8080/api/auth/login

// Requests protegidos incluyen JWT
axios.get('/api/pedidos', {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
```

### Endpoints Consumidos

```
POST   /api/auth/register
       └─ Body: { nombre, email, password }
       └─ Response: { token, email, nombre, rol }

POST   /api/auth/login
       └─ Body: { email, password }
       └─ Response: { token, email, nombre, rol }

GET    /api/auth/me
       └─ Headers: Authorization: Bearer {token}
       └─ Response: Usuario actual

GET    /api/productos
       └─ Response: [ { id, nombre, precio, ... } ]

GET    /api/pedidos
       └─ Headers: Authorization: Bearer {token}
       └─ Response: Pedidos del usuario

POST   /api/pedidos
       └─ Headers: Authorization: Bearer {token}
       └─ Body: Datos del nuevo pedido
       └─ Response: { id, fecha, total, ... }
```

---

## 🎨 Estilos SCSS

### Navbar.scss
```scss
Elementos:
├── .navbar (contenedor principal)
├── .nav-logo (logo)
├── .nav-menu (enlaces de navegación)
├── .nav-actions (carrito y auth)
├── .cart-link (enlace carrito con contador)
└── .auth-button (botones login/logout)
```

### Menu.scss
```scss
Elementos:
├── .menu-section (contenedor)
├── .menu-list (grid de productos)
├── .menu-item (tarjeta de producto)
│   ├── .menu-image
│   ├── .name
│   ├── .text (descripción)
│   ├── .price
│   └── .add-to-cart (botón)
```

### Login.scss / Register.scss
```scss
Elementos:
├── .login-section / .register-section
├── .login-container / .register-container
├── .form-group (label + input)
├── .login-button / .register-button
└── .error-message (mensajes de error)
```

---

## 🚀 Comandos Frontend

```bash
# Instalar dependencias
npm install

# Desarrollo (hot reload)
npm run dev
# Acceder a: http://localhost:5173

# Compilar para producción
npm run build

# Vista previa de compilación
npm run preview

# Linting
npm run lint
```

---

## 📦 Dependencias package.json

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x.x",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "vite": "^7.1.14",
    "@vitejs/plugin-react": "^4.x.x",
    "sass": "^1.x.x"
  }
}
```

---

## ⚡ Optimizaciones Implementadas

✅ Context API para estado global (sin Redux)
✅ React Router para navegación SPA
✅ Vite para bundling rápido
✅ Axios para requests HTTP eficientes
✅ SCSS para estilos modulares
✅ LocalStorage para persistencia de token
✅ Lazy loading de componentes (con React.lazy)
✅ Error boundaries para captura de errores

---

## 🔒 Seguridad Frontend

✅ Token almacenado en localStorage
✅ JWT incluido en cada request protegido
✅ Validación de autenticación en rutas
✅ Logout limpia token y estado
✅ Redirección a login si token inválido
✅ CORS configurado solo para localhost:5173
✅ Sin almacenamiento de información sensible

---

**Frontend completamente funcional y listo para usar** ✅
