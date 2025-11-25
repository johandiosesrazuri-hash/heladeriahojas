import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('user') || sessionStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || sessionStorage.getItem('token'));

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      const data = response.data;

      const tokenResp = data.token;
      const refreshTokenResp = data.refreshToken;
      const userResp = {
        id: data.id,
        email: data.email,
        nombre: data.nombre,
        rol: data.rol
      };

      const storage = rememberMe ? localStorage : sessionStorage;
      const otherStorage = rememberMe ? sessionStorage : localStorage;

      // Guardar en el storage correcto
      storage.setItem('token', tokenResp);
      storage.setItem('refreshToken', refreshTokenResp);
      storage.setItem('user', JSON.stringify(userResp));

      // Limpiar el otro storage
      otherStorage.removeItem('token');
      otherStorage.removeItem('refreshToken');
      otherStorage.removeItem('user');

      setToken(tokenResp);
      setUser(userResp);

      return true;
    } catch (error) {
      console.error('❌ Error during login:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, userData);
      const data = response.data;

      if (data && data.token) {
        const tokenResp = data.token;
        const refreshTokenResp = data.refreshToken;
        const userResp = {
          id: data.id,
          email: data.email,
          nombre: data.nombre,
          rol: data.rol
        };

        // Por defecto usamos localStorage para registro (mejor UX)
        localStorage.setItem('token', tokenResp);
        localStorage.setItem('refreshToken', refreshTokenResp);
        localStorage.setItem('user', JSON.stringify(userResp));
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('user');

        setToken(tokenResp);
        setUser(userResp);
      }
      return data;
    } catch (error) {
      console.error('❌ Error during registration:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };
  const checkAuth = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);

      // Actualizar el storage correcto dependiendo de dónde esté el token
      if (localStorage.getItem('token')) {
        localStorage.setItem('user', JSON.stringify(response.data));
      } else if (sessionStorage.getItem('token')) {
        sessionStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('❌ Error checking auth:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};