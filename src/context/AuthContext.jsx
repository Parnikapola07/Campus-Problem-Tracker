import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('cpt_token');
      const storedUser = localStorage.getItem('cpt_user_profile');

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (collegeId, password) => {
    setLoading(true);
    try {
      const data = await apiService.login(collegeId, password);
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('cpt_token', data.token);
        localStorage.setItem('cpt_user_profile', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        throw new Error(data.message || 'Login failed. Please check credentials.');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (collegeId, password) => {
    setLoading(true);
    try {
      const data = await apiService.adminLogin(collegeId, password);
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('cpt_token', data.token);
        localStorage.setItem('cpt_user_profile', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        throw new Error(data.message || 'Admin authentication failed.');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cpt_token');
    localStorage.removeItem('cpt_user_profile');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    loading,
    login,
    adminLogin,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
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
