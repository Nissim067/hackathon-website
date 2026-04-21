import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'text-indigo-300 bg-slate-800/80'
      : 'text-slate-300 hover:text-indigo-300 hover:bg-slate-800/80',
  ].join(' ');

export default function Layout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div
      className={
        isDarkMode
          ? 'min-h-screen bg-[#0F172A] text-slate-100'
          : 'min-h-screen bg-slate-100 text-slate-900'
      }
    >
      <header
        className={
          isDarkMode
            ? 'sticky top-0 z-50 border-b border-slate-700/60 bg-[#0F172A]/95 backdrop-blur'
            : 'sticky top-0 z-50 border-b border-slate-300 bg-white/95 backdrop-blur'
        }
      >
        <nav className="mx-auto flex w-full max-w-[1100px] items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold tracking-tight text-[#6366F1]">
            Nexathon
          </Link>

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

          <button
            type="button"
            onClick={() => setIsDarkMode((prev) => !prev)}
            className={
              isDarkMode
                ? 'rounded-md border border-slate-600 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-[#6366F1] hover:text-white'
                : 'rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-[#6366F1] hover:text-[#6366F1]'
            }
          >
            {isDarkMode ? 'Light' : 'Dark'}
          </button>
        </nav>

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

      <main className="mx-auto w-full max-w-[1100px] px-4 py-8">{children}</main>

      <footer
        className={
          isDarkMode
            ? 'mt-12 border-t border-slate-800 py-6 text-center text-sm text-slate-400'
            : 'mt-12 border-t border-slate-300 py-6 text-center text-sm text-slate-600'
        }
      >
        AIML Club | Nexathon 2026 | Event Date: March 20, 2026
      </footer>
    </div>
  );
}
