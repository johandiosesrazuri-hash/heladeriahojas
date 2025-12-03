import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = 'ADMIN' }) => {
  const { user, token } = useAuth();
  const location = useLocation();

  console.log('🔒 ProtectedRoute - Token:', !!token);
  console.log('🔒 ProtectedRoute - User:', user);
  console.log('🔒 ProtectedRoute - Required Role:', requiredRole);

  // Verifica si el token no está presente
  if (!token) {
    console.warn('⚠️ Sin token, redirigiendo a login');
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Verifica si no hay usuario
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  const userRoleNormalized = user.rol?.startsWith('ROLE_') ? user.rol.replace('ROLE_', '') : user.rol;

  if (!requiredRole) {
    return children;
  }

  if (Array.isArray(requiredRole)) {
    if (!requiredRole.includes(userRoleNormalized)) {
      return <Navigate to="/" />;
    }
    return children;
  }

  // Si es string, validar igualdad
  if (userRoleNormalized !== requiredRole) {
    console.warn(`❌ Rol insuficiente. Requerido: ${requiredRole}, Actual: ${user.rol}`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
