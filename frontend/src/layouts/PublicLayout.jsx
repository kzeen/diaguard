import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-light font-sans text-dark">
      <PublicNavbar />

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}