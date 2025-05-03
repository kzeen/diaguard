export default function Footer() {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} DiaGuard. All rights reserved.</p>
      </div>
    </footer>
  );
}