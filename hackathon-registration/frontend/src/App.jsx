import { Navigate, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Teams from './pages/Teams.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Login from './pages/Login.jsx';

// Create a helper to safely parse JSON values from localStorage.
function parseStoredJson(value) {
  // Return null quickly when value is missing.
  if (!value) return null;
  try {
    // Parse JSON for valid serialized objects.
    return JSON.parse(value);
  } catch {
    // Return null when parsing fails.
    return null;
  }
}

// Create a helper to decode a JWT payload without third-party libraries.
function decodeJwtPayload(token) {
  // Return null when token is empty or malformed.
  if (!token || typeof token !== 'string') return null;
  const tokenParts = token.split('.');
  if (tokenParts.length < 2) return null;

  try {
    // Convert base64url payload into normal base64 before decoding.
    const normalizedPayload = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4), '=');
    // Decode and parse the JWT payload body.
    return JSON.parse(window.atob(paddedPayload));
  } catch {
    // Return null when payload decoding/parsing fails.
    return null;
  }
}

// Create a guard component that allows only admin users.
export function PrivateAdminRoute({ children }) {
  // Read possible auth user records from localStorage.
  const storedUser = parseStoredJson(localStorage.getItem('user')) || parseStoredJson(localStorage.getItem('authUser'));
  // Read possible JWT tokens from localStorage.
  const storedToken =
    localStorage.getItem('token') ||
    localStorage.getItem('jwt') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('accessToken');
  // Decode token payload so we can check admin claims from JWT.
  const tokenPayload = decodeJwtPayload(storedToken);
  // Resolve admin status from user object, token payload, or direct localStorage override.
  const isAdmin =
    storedUser?.isAdmin === true ||
    tokenPayload?.isAdmin === true ||
    tokenPayload?.user?.isAdmin === true ||
    localStorage.getItem('isAdmin') === 'true';

  // Redirect non-admin users to login page.
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content for admin users.
  return children;
}

// Create the application router and wrap all routes with Layout.
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Render the home page at root route.
      { index: true, element: <Home /> },
      // Render registration page for participant signups.
      { path: 'register', element: <Register /> },
      // Render teams page for team-related view.
      { path: 'teams', element: <Teams /> },
      // Protect admin dashboard route so only admins can access.
      {
        path: 'admin',
        element: (
          <PrivateAdminRoute>
            <AdminDashboard />
          </PrivateAdminRoute>
        ),
      },
      // Render login page for user/admin authentication.
      { path: 'login', element: <Login /> },
    ],
  },
]);

// Export router for use in main entry.
export default router;
