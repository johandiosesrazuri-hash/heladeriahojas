import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = 'ROLE_ADMIN' }) => {
  const { user, token } = useAuth();
  const location = useLocation();  // Utilizado para redirigir a la página de destino después de login

  // Verifica si el token no está presente, redirige al login con el estado de la ubicación actual
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Verifica si el usuario no tiene el rol requerido, redirige a la página principal
  if (user?.rol !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;  // Si pasa las condiciones, muestra el contenido protegido
};

export default ProtectedRoute;
