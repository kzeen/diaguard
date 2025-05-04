import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
  const { logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = async () => {
    await logout();
    nav('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-light font-sans text-dark">
      <header className="bg-white shadow p-4">
        <nav className="max-w-6xl mx-auto flex justify-between items-center">
          <NavLink to="/" className="text-xl font-bold text-primary">
            DiaGuard
          </NavLink>

          <div className="space-x-4">
            <NavLink to="/dashboard" className="text-sm font-medium hover:text-primary">
              Dashboard
            </NavLink>
            <NavLink to="/predict" className="text-sm font-medium hover:text-primary">
              Predict
            </NavLink>
            <NavLink to="/history" className="text-sm font-medium hover:text-primary">
              History
            </NavLink>
            <NavLink to="/profile" className="text-sm font-medium hover:text-primary">
              Profile
            </NavLink>
            <NavLink to="/help" className="text-sm font-medium hover:text-primary">
              Help
            </NavLink>
            <button
              onClick={handleLogout}
              className="ml-4 text-sm font-medium bg-primary text-white px-3 py-1.5 rounded hover:bg-primary/90 transition-colors"
            >
              Log out
            </button>
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-6xl mx-auto p-6">
        <Outlet />
      </main>

      <footer className="bg-white border-t mt-12 p-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} DiaGuard. All rights reserved.
      </footer>
    </div>
  );
}
