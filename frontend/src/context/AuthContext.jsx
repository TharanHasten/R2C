import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    // Set Axios Authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Listen for storage changes (e.g., login/logout in another tab)
    const handleStorageChange = (event) => {
      if (event.key === 'token') {
        setIsAuthenticated(!!event.newValue);
        if (event.newValue) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${event.newValue}`;
        } else {
          delete axios.defaults.headers.common['Authorization'];
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
    window.dispatchEvent(new StorageEvent('storage', { key: 'token', newValue: token }));
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    window.dispatchEvent(new StorageEvent('storage', { key: 'token', newValue: null }));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};