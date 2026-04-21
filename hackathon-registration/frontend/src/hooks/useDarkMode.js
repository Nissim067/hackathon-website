// Import React hooks for state and lifecycle behavior.
import { useEffect, useState } from 'react';

// Keep the localStorage key in one place.
const THEME_KEY = 'nexathon-theme';

// Export a reusable dark mode hook.
export default function useDarkMode() {
  // Initialize dark mode by checking localStorage first, then system preference.
  const [isDark, setIsDark] = useState(() => {
    // Read saved theme from localStorage.
    const savedTheme = localStorage.getItem(THEME_KEY);
    // Respect explicit saved dark preference.
    if (savedTheme === 'dark') return true;
    // Respect explicit saved light preference.
    if (savedTheme === 'light') return false;
    // Fallback to system preference if nothing is saved.
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply/remove the "dark" class and persist value whenever mode changes.
  useEffect(() => {
    // Add dark class to html root when dark mode is active.
    document.documentElement.classList.toggle('dark', isDark);
    // Save selected mode in localStorage for future visits.
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  // Toggle helper to switch between dark and light mode.
  const toggleDark = () => {
    // Flip current mode value.
    setIsDark((prev) => !prev);
  };

  // Return hook API in requested tuple format.
  return [isDark, toggleDark];
}
