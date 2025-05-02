import { Outlet, NavLink } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-light text-dark font-sans">
      <header className="bg-white shadow p-4">
        <nav className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">DiaGuard</h1>
          <div className="space-x-4">
            <NavLink to="/dashboard" className="text-sm font-medium hover:text-primary">Dashboard</NavLink>
            <NavLink to="/predict" className="text-sm font-medium hover:text-primary">Predict</NavLink>
            <NavLink to="/history" className="text-sm font-medium hover:text-primary">History</NavLink>
            <NavLink to="/profile" className="text-sm font-medium hover:text-primary">Profile</NavLink>
            <NavLink to="/help" className="text-sm font-medium hover:text-primary">Help</NavLink>
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