import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-slate-800 text-white'
      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white',
  ].join(' ');

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <NavLink
          to="/"
          className="text-lg font-semibold tracking-tight text-white transition hover:text-violet-300"
        >
          AIML Hackathon
        </NavLink>
        <div className="flex flex-1 flex-wrap items-center justify-center gap-1 sm:justify-end md:flex-none md:justify-center md:gap-2">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/register" className={linkClass}>
            Register
          </NavLink>
          <NavLink to="/admin" className={linkClass}>
            Admin
          </NavLink>
        </div>
        <NavLink
          to="/register"
          className="shrink-0 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:bg-violet-500 hover:shadow-violet-800/40"
        >
          Register Now
        </NavLink>
      </nav>
    </header>
  );
}
