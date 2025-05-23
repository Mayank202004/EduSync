import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const BASEURL = import.meta.env.VITE_API_BASE_URL;
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axiosInstance.get("/users/me")
      .then((res) => {
      setIsAuthenticated(true);
      setUser(res.data.data);
    })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };
  const logout = async () => {
    await axiosInstance.post('/logout');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, logout,user, setUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
