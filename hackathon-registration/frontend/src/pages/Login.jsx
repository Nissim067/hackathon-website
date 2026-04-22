import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md rounded-2xl border border-indigo-500/20 bg-slate-800/80 p-8 shadow-xl">
      <h1 className="text-3xl font-extrabold text-white">Login</h1>
      <p className="mt-2 text-slate-400 text-sm">Enter your registered email to access your dashboard.</p>
      
      {error && <div className="mt-4 rounded border border-red-500/50 bg-red-900/30 p-3 text-sm text-red-200">{error}</div>}

      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="you@example.com"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-500 py-2.5 font-semibold text-white transition hover:bg-indigo-600"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
