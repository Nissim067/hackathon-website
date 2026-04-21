import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Create login page with form, loading, and error handling.
export default function Login() {
  // Store controlled form values.
  const [formData, setFormData] = useState({ email: '', password: '' });
  // Track submission loading state.
  const [isLoading, setIsLoading] = useState(false);
  // Track visible error message for failed logins.
  const [error, setError] = useState('');
  // Access router navigation helper.
  const navigate = useNavigate();

  // Handle input changes for controlled fields.
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // Handle form submission and placeholder auth flow.
  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Add minimal validation before backend auth integration.
      if (!formData.email || !formData.password) {
        throw new Error('Please enter both email and password');
      }

      // Store simple demo admin hint; replace with real auth API result.
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } catch (submitError) {
      setError(submitError.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-12">
        {/* Render login heading block. */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="mt-2 text-[#94A3B8]">Sign in to access admin dashboard.</p>
        </header>

        {/* Render login card and form controls. */}
        <section className="rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#0D1424] p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-[#94A3B8]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-[#F1F5F9] outline-none focus:border-[#6366F1]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm text-[#94A3B8]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-[#F1F5F9] outline-none focus:border-[#6366F1]"
                placeholder="Enter password"
              />
            </div>

            {/* Render error feedback when login fails. */}
            {error && (
              <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#6366F1] px-4 py-2.5 font-semibold text-white transition hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
