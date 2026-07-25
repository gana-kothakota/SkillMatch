import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const res = await api.get('/users/me/');
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
          console.error("Failed to load user profile", err);
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login/', { email, password });
      const { access, refresh, user: userData } = res.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      toast.success(`Welcome back, ${userData.username}!`);
      return userData;
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.errors?.detail || 'Invalid login credentials.';
      toast.error(msg);
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register/', formData);
      const { tokens, user: userData } = res.data;

      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      toast.success('Account registered successfully!');
      return userData;
    } catch (err) {
      const errors = err.response?.data?.errors || err.response?.data || {};
      const msg = typeof errors === 'string' ? errors : Object.values(errors).flat().join(' ');
      toast.error(msg || 'Registration failed.');
      throw err;
    }
  };

  const googleOAuthLogin = async (oauthData) => {
    try {
      const res = await api.post('/auth/google/', oauthData);
      const { tokens, user: userData } = res.data;

      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      toast.success(`Google Auth Successful! Welcome, ${userData.username}.`);
      return userData;
    } catch (err) {
      toast.error('Google OAuth authentication failed.');
      throw err;
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await api.post('/auth/logout/', { refresh: refreshToken });
      } catch (err) {
        console.error("Logout error", err);
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully.');
  };

  const updateUserProfile = (updatedData) => {
    setUser(updatedData);
    localStorage.setItem('user', JSON.stringify(updatedData));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleOAuthLogin, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
