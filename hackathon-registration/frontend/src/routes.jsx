import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Success from './pages/Success.jsx';
import Failure from './pages/Failure.jsx';
import Admin from './pages/Admin.jsx';
import Teams from './pages/Teams.jsx';
import Login from './pages/Login.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'register', element: <Register /> },
      { path: 'success', element: <Success /> },
      { path: 'failure', element: <Failure /> },
      { path: 'admin', element: <Admin /> },
      { path: 'teams', element: <Teams /> },
      { path: 'login', element: <Login /> },
    ],
  },
]);
