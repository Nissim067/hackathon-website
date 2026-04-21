import { Outlet } from 'react-router-dom';

// Create the shared app layout wrapper used by every route.
export default function Layout() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-[#F1F5F9]">
      {/* Render the matched child route inside the global layout shell. */}
      <Outlet />
    </div>
  );
}
