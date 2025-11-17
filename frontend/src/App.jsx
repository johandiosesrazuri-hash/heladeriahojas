import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
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

// Páginas Admin
import AdminDashboard from './pages/Admin/Dashboard'
import GestionUsuarios from './pages/Admin/GestionUsuarios'
import GestionProductos from './pages/Admin/GestionProductos'
import GestionPedidos from './pages/Admin/GestionPedidos'
import GestionContactos from './pages/Admin/GestionContactos'

import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
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
            <Route path="/" element={<Menu />} />

            {/* Rutas protegidas - Admin */}
            <Route 
              path="/admin/dashboard" 
              element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} 
            />
            <Route 
              path="/admin/usuarios" 
              element={<ProtectedRoute><GestionUsuarios /></ProtectedRoute>} 
            />
            <Route 
              path="/admin/productos" 
              element={<ProtectedRoute><GestionProductos /></ProtectedRoute>} 
            />
            <Route 
              path="/admin/pedidos" 
              element={<ProtectedRoute><GestionPedidos /></ProtectedRoute>} 
            />
            <Route 
              path="/admin/contactos" 
              element={<ProtectedRoute><GestionContactos /></ProtectedRoute>} 
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