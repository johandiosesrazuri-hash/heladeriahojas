import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email, password) => {
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.post(`${api}/api/auth/login`, {
        email,
        password
      });
      const data = response.data;
      const tokenResp = data.token;
      const userResp = { email: data.email, nombre: data.nombre, rol: data.rol };
      localStorage.setItem('token', tokenResp);
      localStorage.setItem('user', JSON.stringify(userResp));
      setToken(tokenResp);
      setUser(userResp);
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.post(`${api}/api/auth/register`, userData);
      const data = response.data;
      // If backend returns token, save and set user (auto-login after register)
      if (data && data.token) {
        const tokenResp = data.token;
        const userResp = { email: data.email, nombre: data.nombre, rol: data.rol };
        localStorage.setItem('token', tokenResp);
        localStorage.setItem('user', JSON.stringify(userResp));
        setToken(tokenResp);
        setUser(userResp);
      }
      return data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const checkAuth = async () => {
    if (!token) return;
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.get(`${api}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error checking auth:', error);
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