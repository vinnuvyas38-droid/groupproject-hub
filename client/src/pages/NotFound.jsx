// pages/NotFound.jsx
// 404 page for unmatched routes.

import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto my-16 text-center px-4">
      <div className="text-6xl font-extrabold text-blue-600 mb-3">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-sm text-gray-600 mb-6">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary">Back to Dashboard</Button>
      </Link>
    </div>
  );
}

