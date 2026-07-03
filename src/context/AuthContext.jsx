import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const API_URL = 'https://zentask-backend-618a.onrender.com/api';


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth state on load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Fetch fresh user data to verify token
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (res.ok) {
            const freshUser = await res.json();
            setUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
          } else {
            // Token expired or invalid
            logout();
          }
        } catch (err) {
          console.error('Error verifying token:', err);
          // Don't log out immediately on network error, keep local storage user for offline resilience
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setToken(data.token);
      const userData = { _id: data._id, username: data.username, email: data.email };
      setUser(userData);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setLoading(false);
      return userData;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setToken(data.token);
      const userData = { _id: data._id, username: data.username, email: data.email };
      setUser(userData);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setLoading(false);
      return userData;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Helper fetcher with token automatic injection
  const fetchWithAuth = async (url, options = {}) => {
    const storedToken = localStorage.getItem('token') || token;
    
    if (!storedToken) {
      throw new Error('No authentication token available');
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${storedToken}`,
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Automatic logout on unauthorized status
      logout();
      throw new Error('Session expired. Please log in again.');
    }

    return response;
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    fetchWithAuth,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
