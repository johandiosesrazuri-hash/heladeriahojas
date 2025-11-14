import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Register from './components/Register'
import Menu from './components/Menu'
import Carrito from './components/Carrito'
import Promociones from './components/Promociones'
import Contacto from './components/Contacto'
import Pedido from './components/Pedido'
import './App.css'
import Footer from './components/Footer'

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
        <Footer />
      </AuthProvider>
    </Router>
  )
}

export default App
