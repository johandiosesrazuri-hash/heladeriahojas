import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Páginas públicas
import Login from './components/Login'
import Register from './components/Register'
import Menu from './components/Menu'
import Carrito from './components/Carrito'
import Promociones from './components/Promociones'
import Contacto from './components/Contacto'
import Pedido from './components/Pedido'
import Testimonios from './components/Testimonios'
import SobreNosotros from './components/SobreNosotros'
import MisPedidos from './components/MisPedidos'


// Páginas Admin
import AdminDashboard from './pages/Admin/AdminDashboard'
import GestionUsuarios from './pages/Admin/GestionUsuarios'
import GestionProductos from './pages/Admin/GestionProductos'
import GestionPedidos from './pages/Admin/GestionPedidos'
import GestionContactos from './pages/Admin/GestionContactos'

import './App.css'

// Componente para debug
function AuthDebug() {
  const { user, token } = useAuth();
  console.log('🔍 AuthDebug - Token:', !!token);
  console.log('🔍 AuthDebug - User:', user);
  return null;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AuthDebug />
          <Navbar />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/pedidos" element={<Pedido />} />
            <Route path="/promociones" element={<Promociones />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/testimonios" element={<Testimonios />} />
            <Route path="/sobre-nosotros" element={<SobreNosotros />} />
            <Route path="/mis-pedidos" element={<MisPedidos />} />

            <Route path="/" element={<Menu />} />

            {/* Rutas protegidas - Admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/usuarios"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <GestionUsuarios />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/productos"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <GestionProductos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pedidos"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <GestionPedidos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/contactos"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <GestionContactos />
                </ProtectedRoute>
              }
            />

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App