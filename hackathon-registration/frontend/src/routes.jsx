import { createBrowserRouter } from 'react-router-dom';
import App, { PrivateAdminRoute } from './App.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Success from './pages/Success.jsx';
import Failure from './pages/Failure.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'register', element: <Register /> },
      { path: 'success', element: <Success /> },
      { path: 'failure', element: <Failure /> },
      // Protect admin dashboard route so only admins can view it.
      {
        path: 'admin',
        element: (
          <PrivateAdminRoute>
            <AdminDashboard />
          </PrivateAdminRoute>
        ),
      },
    ],
  },
]);
