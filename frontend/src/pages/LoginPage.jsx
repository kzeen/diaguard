import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';
import formatError from '../utils/formatError';

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleLogin = async (username, password) => {
    try {
      setErr('');
      setLoading(true);
      await login(username, password);
      nav('/dashboard', { replace: true});
      window.scrollTo(0, 0);
    } catch (e) {
      setErr(formatError(e.response?.data));
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
