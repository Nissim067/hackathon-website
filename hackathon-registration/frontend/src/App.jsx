import { Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import useDarkMode from './hooks/useDarkMode';

export default function App() {
  // Initialize dark mode as soon as app loads.
  const [isDark, toggleDark] = useDarkMode();

  return (
    <Layout isDark={isDark} toggleDark={toggleDark}>
      <Outlet />
    </Layout>
  );
}
