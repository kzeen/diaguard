import { Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Fab() {
  return (
    <NavLink
      to="/predict"
      className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition">
      <Plus />
    </NavLink>
  );
}