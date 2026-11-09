// components/layout/NoProjectPrompt.jsx
// Shown on project-scoped pages when no project is currently selected.
// Prompts the user to pick or create a project with a direct button.

import { Link } from 'react-router-dom';
import Button from '../ui/Button';

export default function NoProjectPrompt({ featureName = 'this feature' }) {
  return (
    <div className="max-w-md mx-auto my-12 p-8 text-center bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="text-5xl mb-3">📁</div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">No Project Selected</h2>
      <p className="text-sm text-gray-600 mb-6">
        Please select an existing project or create a new one to access {featureName}.
      </p>
      <Link to="/projects">
        <Button variant="primary">Go to Projects</Button>
      </Link>
    </div>
  );
}

