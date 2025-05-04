import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout } from '../services/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setUser({ token });
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const { data } = await apiLogin(username, password);
    localStorage.setItem('token', data.token);
    setUser({ token: data.token });
  };

  const signup = async (username, email, password) => {
    const { data } = await apiSignup(username, email, password);
    localStorage.setItem('token', data.token);
    setUser({ token: data.token });
  };

  const logout = async () => {
    await apiLogout();
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
