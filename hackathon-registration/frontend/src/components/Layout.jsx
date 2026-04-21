// Import routing helpers for nav links.
import { Link, NavLink } from 'react-router-dom';
// Import the reusable dark mode icon toggle button.
import DarkModeToggle from './DarkModeToggle';

// Export app-wide layout wrapper.
export default function Layout({ children, isDark, toggleDark }) {
  // Build nav link styles with dark mode classes.
  const navLinkClass = ({ isActive }) =>
    [
      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'text-indigo-300 bg-slate-200 dark:bg-slate-800/80'
        : 'text-slate-600 hover:text-indigo-300 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-indigo-300 dark:hover:bg-slate-800/80',
    ].join(' ');

  return (
    // Main background that reacts to dark mode class.
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-[#0A0F1E] dark:text-[#F1F5F9]">
      {/* Top navigation header. */}
      <header className="sticky top-0 z-50 border-b border-slate-300 bg-white/95 backdrop-blur dark:border-indigo-500/20 dark:bg-[#0A0F1E]/95">
        {/* Desktop navbar row. */}
        <nav className="mx-auto flex w-full max-w-[1100px] items-center justify-between px-4 py-4">
          {/* Brand/logo link. */}
          <Link to="/" className="text-xl font-bold tracking-tight text-[#6366F1]">
            Nexathon
          </Link>

          {/* Desktop nav links. */}
          <div className="hidden items-center gap-1 md:flex">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/register" className={navLinkClass}>
              Register
            </NavLink>
            <NavLink to="/teams" className={navLinkClass}>
              Teams
            </NavLink>
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
          </div>

          {/* Dark mode icon toggle button. */}
          <DarkModeToggle isDark={isDark} toggleDark={toggleDark} />
        </nav>

        {/* Mobile nav links row. */}
        <div className="mx-auto w-full max-w-[1100px] px-4 pb-3 md:hidden">
          <div className="flex items-center gap-2 overflow-x-auto">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/register" className={navLinkClass}>
              Register
            </NavLink>
            <NavLink to="/teams" className={navLinkClass}>
              Teams
            </NavLink>
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
          </div>
        </div>
      </header>

      {/* Centered page content area. */}
      <main className="mx-auto w-full max-w-[1100px] px-4 py-8">{children}</main>

      {/* Footer text block. */}
      <footer className="mt-12 border-t border-slate-300 py-6 text-center text-sm text-slate-600 dark:border-indigo-500/20 dark:text-[#94A3B8]">
        AIML Club | Nexathon 2026 | Event Date: March 20, 2026
      </footer>
    </div>
  );
}
