import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
  const { logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = async () => {
    await logout();
    nav('/');
  };

  const linkCls = ({ isActive }) =>
    `relative px-2 py-1 text-sm font-medium transition-colors
     ${isActive ? 'text-primary after:w-full' : 'text-gray-700 hover:text-primary'}
     after:absolute after:-bottom-0.5 after:left-0 after:h-0.5
     after:bg-primary after:rounded-full after:transition-all
     ${isActive ? '' : 'after:w-0 hover:after:w-full'}
    `;

  return (
    <div className="min-h-screen flex flex-col bg-light font-sans text-dark">
      {/* ---------- header ---------- */}
      <header className="bg-white shadow-sm">
        <div className="max-w-screen-xl mx-auto px-8 flex justify-between items-center h-16">
          <NavLink to="/" className="text-2xl font-extrabold text-primary">
            DiaGuard
          </NavLink>

          <nav className="flex items-center gap-6">
            <NavLink to="/dashboard" className={linkCls}>Dashboard</NavLink>
            <NavLink to="/predict" className={linkCls}>Predict</NavLink>
            <NavLink to="/history" className={linkCls}>History</NavLink>
            <NavLink to="/profile" className={linkCls}>Profile</NavLink>
            <NavLink to="/help" className={linkCls}>Help</NavLink>

            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold
                         hover:bg-primary/90 transition-colors shadow"
            >
              Log&nbsp;out
            </button>
          </nav>
        </div>
      </header>

      {/* ---------- main ---------- */}
      <main className="flex-1 max-w-screen-xl mx-auto px-8 py-10">
        <Outlet />
      </main>

      {/* ---------- footer ---------- */}
      <footer className="bg-white border-t">
        <div className="max-w-screen-xl mx-auto px-8 py-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} DiaGuard. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
