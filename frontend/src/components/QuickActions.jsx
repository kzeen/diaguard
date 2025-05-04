import { NavLink } from 'react-router-dom';
import { Plus, History, User } from 'lucide-react';

const btn =
  'bg-white shadow rounded-lg p-6 flex flex-col items-center hover:bg-light transition';

export default function QuickActions() {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <NavLink to="/predict" className={btn}>
        <Plus className="mb-2" />
        New Prediction
      </NavLink>
      <NavLink to="/history" className={btn}>
        <History className="mb-2" />
        View History
      </NavLink>
      <NavLink to="/profile" className={btn}>
        <User className="mb-2" />
        Edit Profile
      </NavLink>
    </div>
  );
}