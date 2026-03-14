import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('cs_token'));
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await api.get('/users/me');
      setUser(res.data);
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem('cs_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) fetchMe();
    else setLoading(false);
  }, [token, fetchMe]);

  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    const { token: t, user: u } = res.data;
    localStorage.setItem('cs_token', t);
    setToken(t);
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    const { token: t, user: u } = res.data;
    localStorage.setItem('cs_token', t);
    setToken(t);
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('cs_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = () => fetchMe();

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
