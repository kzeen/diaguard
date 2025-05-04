import { useState } from 'react';
import ErrorBanner from './ErrorBanner';

export default function AuthForm({ mode = 'login', onSubmit, loading, error }) {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPass]     = useState('');

  const handle = (e) => {
    e.preventDefault();
    if (mode === 'signup') onSubmit(username, email, password);
    else onSubmit(username, password);
  };

  return (
    <form
      onSubmit={handle}
      className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-center capitalize">
        {mode === 'login' ? 'Log in' : 'Sign up'}
      </h2>

      <ErrorBanner message={error} />

      {/* Username always required */}
      <div className="mb-4">
        <label className="block mb-1 text-sm">Username</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      {/* Email only for signup */}
      {mode === 'signup' && (
        <div className="mb-4">
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      )}

      <div className="mb-6">
        <label className="block mb-1 text-sm">Password</label>
        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPass(e.target.value)}
          required
        />
      </div>

      <button
        disabled={loading}
        className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
      >
        {loading
          ? 'Please wait…'
          : mode === 'login'
          ? 'Log in'
          : 'Create account'}
      </button>
    </form>
  );
}
