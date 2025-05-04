import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout, getMe } from '../services/auth';
import Spinner from '../components/Spinner';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await getMe();
        setUser({ token, ...data });
      } catch {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = async (username, password) => {
    const { data } = await apiLogin(username, password);
    localStorage.setItem('token', data.token);
    const me = await getMe().then(r => r.data);
    setUser({ token: data.token, ...me });
  };

  const signup = async (username, email, password) => {
    const { data } = await apiSignup(username, email, password);
    localStorage.setItem('token', data.token);
    const me = await getMe().then(r => r.data);
    setUser({ token: data.token, ...me });;
  };

  const logout = async () => {
    await apiLogout().catch(() => {});
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) return <Spinner/>;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
