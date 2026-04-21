import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

// Create teams page with safe loading and error states.
export default function Teams() {
  // Track loading state for teams content.
  const [isLoading, setIsLoading] = useState(true);
  // Track errors for future API-based teams loading.
  const [error, setError] = useState('');

  // Simulate an initial load phase for a consistent UX pattern.
  useEffect(() => {
    // Wrap initialization in try/catch for defensive handling.
    try {
      setIsLoading(true);
      setError('');
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    } catch {
      setError('Failed to load teams page');
      setIsLoading(false);
      return undefined;
    }
  }, []);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* Render page heading and short description. */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="mt-2 text-[#94A3B8]">Manage and view participating teams.</p>
        </header>

        {/* Render loading state while page prepares data. */}
        {isLoading && (
          <div className="rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#0D1424] p-6 text-[#94A3B8]">
            Loading teams...
          </div>
        )}

        {/* Render error state when something goes wrong. */}
        {error && !isLoading && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-red-300">
            {error}
          </div>
        )}

        {/* Render fallback content when loading succeeds. */}
        {!isLoading && !error && (
          <section className="rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#0D1424] p-6">
            <p className="text-[#94A3B8]">
              Team listing UI is ready for backend integration. Connect your team endpoint to show live
              team data here.
            </p>
          </section>
        )}
      </main>
    </>
  );
}
