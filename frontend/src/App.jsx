import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Register from './components/Register'
import Menu from './components/Menu'
import Carrito from './components/Carrito'
import Promociones from './components/Promociones'
import Pedido from './components/Pedido'
import './App.css'

// Componentes para rutas no implementadas aún
const Contacto = () => (
  <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: 'calc(100vh - 80px)' }}>
    <h2>📞 Contacto</h2>
    <p>Próximamente habilitaremos nuestro formulario de contacto</p>
  </div>
)

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/pedidos" element={<Pedido />} />
            <Route path="/promociones" element={<Promociones />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/" element={<Menu />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
