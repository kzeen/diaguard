import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicNavbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = async () => {
    await logout();
    nav('/');
  }

  return (
    <header className="w-full bg-white shadow">
      <nav className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Brand */}
        <NavLink to="/" className="text-2xl font-bold text-primary">
          DiaGuard
        </NavLink>

        {/* CTA buttons */}
        {!user ? (
          <div className="space-x-3">
            <NavLink
              to="/login"
              className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded hover:bg-primary hover:text-white transition-colors">
              Log in
            </NavLink>
            <NavLink
              to="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded hover:bg-primary/90 transition-colors">
              Sign up
            </NavLink>
          </div>
        ) : (
          <div className="space-x-3">
            <NavLink
              to="/dashboard"
              className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded hover:bg-primary hover:text-white transition-colors">
              Dashboard
            </NavLink>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-primary/90 transition-colors">
              Log out
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}