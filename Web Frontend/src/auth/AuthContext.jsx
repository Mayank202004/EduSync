import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { logoutApi } from '@/services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [roleInfo, setRoleInfo] = useState(null);

  useEffect(() => {
    axiosInstance.get("/users/me")
      .then((res) => {
      setIsAuthenticated(true);
      setUser(res.data.data.user);
      setRoleInfo(res.data.data.roleData);
    })
    .catch(() => setIsAuthenticated(false))
    .finally(() => setLoading(false));
  }, []);
  
  const login = (userData) => {
    setUser(userData.user);
    setRoleInfo(userData.roleData);
    console.log(userData.roleData);
    setIsAuthenticated(true);
  };
  const logout = async () => {
    await logoutApi();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, logout,user, setUser, login, roleInfo}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
