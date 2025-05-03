/* eslint-disable no-irregular-whitespace */
import { NavLink } from 'react-router-dom';

export default function PublicNavbar() {
  return (
    <header className="w-full bg-white shadow">
      <nav className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Brand */}
        <NavLink to="/" className="text-2xl font-bold text-primary">
          DiaGuard
        </NavLink>

        {/* CTA buttons */}
        <div className="space-x-3">
          <NavLink
            to="/login"
            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded hover:bg-primary hover:text-white transition-colors">
            Log in
          </NavLink>
          <NavLink
            to="/signup"
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded hover:bg-primary/90 transition-colors">
            Sign up
          </NavLink>
        </div>
      </nav>
    </header>
  );
}