// Export small icon toggle button for dark mode.
export default function DarkModeToggle({ isDark, toggleDark }) {
  return (
    // Circular button wrapper for dark mode toggle.
    <button
      type="button"
      onClick={toggleDark}
      aria-label="Toggle dark mode"
      className="relative h-10 w-10 rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
    >
      {/* Center icon container for smooth opacity swap. */}
      <span className="absolute inset-0 flex items-center justify-center">
        {/* Sun icon shown in dark mode. */}
        <svg
          viewBox="0 0 24 24"
          className={`h-5 w-5 transition-all duration-300 ${isDark ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        {/* Moon icon shown in light mode. */}
        <svg
          viewBox="0 0 24 24"
          className={`absolute h-5 w-5 transition-all duration-300 ${isDark ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 15.5A8.5 8.5 0 1 1 8.5 4a7 7 0 1 0 11.5 11.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
