// components/layout/ProjectSwitcher.jsx
// Dropdown in the navbar to quickly view/switch the active project,
// or navigate to /projects to create a new one.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { projectApi } from '../../services/api';

export default function ProjectSwitcher() {
  const { project, selectProject } = useProject();
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  // Load available projects on mount
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await projectApi.getAll();
        setProjects(res.data.data || []);
      } catch (err) {
        // Silently ignore if server is unreachable
      }
    }
    loadProjects();
  }, [project?._id]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (val === '__manage__') {
      navigate('/projects');
      return;
    }
    const found = projects.find((p) => p._id === val);
    selectProject(found || null);
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={project?._id || ''}
        onChange={handleChange}
        className="text-xs bg-blue-800 text-white rounded-md px-2 py-1 border border-blue-500 focus:outline-none focus:ring-1 focus:ring-white max-w-[180px] sm:max-w-[220px] truncate"
        aria-label="Active Project"
      >
        <option value="">No Project Selected</option>
        {projects.map((p) => (
          <option key={p._id} value={p._id}>
            📁 {p.name}
          </option>
        ))}
        <option value="__manage__">➕ Manage / Create Project...</option>
      </select>
    </div>
  );
}

