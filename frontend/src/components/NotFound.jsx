import { Link } from 'react-router-dom';
export default function NotFound() {
    return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <p className="text-gray-600">The page you’re looking for doesn’t exist.</p>
            <Link
                to="/dashboard"
                className="px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90"
            >
                Go home
            </Link>
        </div>
    );
}
