import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';
import formatError from '../utils/formatError';
import usePageTitle from '../hooks/usePageTitle';

export default function LoginPage() {
  usePageTitle('Login');

  const { login } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // On mount, check for a saved login error from sessionStorage
  useEffect(() => {
    const savedError = sessionStorage.getItem('loginError');
    if (savedError) {
      setErr(savedError);
      sessionStorage.removeItem('loginError');
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      setErr('');
      setLoading(true);
      await login(username, password);
      nav('/dashboard', { replace: true });
      window.scrollTo(0, 0);
    } catch (e) {
      // Persist the formatted error and reload
      const msg = formatError(e.response?.data);
      sessionStorage.setItem('loginError', msg);
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <AuthForm mode="login" onSubmit={handleLogin} loading={loading} error={err} />

      <div className="text-sm text-center mt-4 w-full max-w-md">
        No account?{' '}
        <NavLink to="/signup" className="text-primary underline">
          Sign up
        </NavLink>
      </div>
    </div>
  );
}
