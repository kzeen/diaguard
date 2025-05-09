import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';
import formatError from '../utils/formatError';
import usePageTitle from '../hooks/usePageTitle';

export default function SignupPage() {
  usePageTitle('Sign up');

  const { signup } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSignup = async (username, email, password) => {
    try {
      setErr('');
      setLoading(true);
      await signup(username, email, password);
      nav('/dashboard', { replace: true });
      window.scrollTo(0, 0);
    } catch (e) {
      const code = e.response?.status;
      setErr(`${code ? code + ' - ' : ''}${formatError(e.response?.data || e.message)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <AuthForm mode="signup" onSubmit={handleSignup} loading={loading} error={err} />

      <div className="text-sm text-center mt-4 w-full max-w-md">
        Already have an account?{' '}
        <NavLink to="/login" className="text-primary underline">
          Log in
        </NavLink>
      </div>
    </div>
  );
}
