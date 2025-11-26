import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { lazy, Suspense } from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartModal from './components/CartModal'

// Páginas públicas - Carga normal (críticas)
import Login from './components/Login'
import Register from './components/Register'
import Inicio from './components/Inicio'

// Lazy loading para páginas menos críticas
const ForgotPassword = lazy(() => import('./components/ForgotPassword'))
const ResetPassword = lazy(() => import('./components/ResetPassword'))
const Menu = lazy(() => import('./components/Menu'))
const Promociones = lazy(() => import('./components/Promociones'))
const Contacto = lazy(() => import('./components/Contacto'))
const Pedido = lazy(() => import('./components/Pedido'))
const Testimonios = lazy(() => import('./components/Testimonios'))
const SobreNosotros = lazy(() => import('./components/SobreNosotros'))
const MisPedidos = lazy(() => import('./components/MisPedidos'))

// Lazy loading para páginas Admin (code splitting)
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'))
const GestionUsuarios = lazy(() => import('./pages/Admin/GestionUsuarios'))
const GestionProductos = lazy(() => import('./pages/Admin/GestionProductos'))
const GestionPedidos = lazy(() => import('./pages/Admin/GestionPedidos'))
const GestionContactos = lazy(() => import('./pages/Admin/GestionContactos'))
const GestionPromociones = lazy(() => import('./pages/Admin/GestionPromociones'))
const GestionSobreNosotros = lazy(() => import('./pages/Admin/GestionSobreNosotros'))
const Perfil = lazy(() => import('./pages/Perfil'))

import './App.css'

// Componente de carga mientras se cargan componentes
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      <p className="mt-4 text-neutral-600">Cargando...</p>
    </div>
  </div>
)

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Navbar />
            <CartModal />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                {/* Rutas protegidas para usuarios autenticados */}
                <Route path="/menu" element={<Menu />} />
                <Route path="/pedidos" element={<Pedido />} />
                <Route path="/promociones" element={<Promociones />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/testimonios" element={<Testimonios />} />
                <Route path="/sobre-nosotros" element={<SobreNosotros />} />
                <Route path="/mis-pedidos" element={<MisPedidos />} />
                <Route
                  path="/perfil"
                  element={
                    <ProtectedRoute requiredRole={['CLIENTE', 'ADMIN']}>
                      <Perfil />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Inicio />} />

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
                <Route
                  path="/admin/promociones"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <GestionPromociones />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/sobre-nosotros"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <GestionSobreNosotros />
                    </ProtectedRoute>
                  }
                />

                {/* Ruta por defecto */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            <Footer />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
