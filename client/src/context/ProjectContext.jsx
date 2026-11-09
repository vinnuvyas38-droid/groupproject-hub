// context/ProjectContext.jsx
// Stores and shares the currently-selected project across every page.
//
// How it works:
//   1. On first load, tries to read the project id from localStorage.
//   2. If found, fetches the project details from the API.
//   3. When the user selects a different project, updates state + localStorage.
//   4. Every page that needs the project id just calls useProject().
//
// localStorage reads/writes are wrapped in try/catch so private browsing
// or full storage doesn't crash the app.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { projectApi } from '../services/api';

// Create the context — this is what useProject() reads from
const ProjectContext = createContext(null);

// ── Provider component ──────────────────────────────────────────────────────
// Wrap your app in <ProjectProvider> so every child can access the project.
export function ProjectProvider({ children }) {
  const [project, setProject] = useState(null);       // the full project object { _id, name, ... }
  const [loading, setLoading] = useState(true);        // true while we're checking localStorage on startup

  // On mount: try to restore the selected project from localStorage
  useEffect(() => {
    async function restoreProject() {
      try {
        const savedId = localStorage.getItem('selectedProjectId');
        if (savedId) {
          // Fetch the project from the API to make sure it still exists
          const res = await projectApi.getOne(savedId);
          setProject(res.data.data);
        }
      } catch (err) {
        // Project was deleted or localStorage is broken — clear it
        try { localStorage.removeItem('selectedProjectId'); } catch (e) { /* ignore */ }
        setProject(null);
      } finally {
        setLoading(false);
      }
    }
    restoreProject();
  }, []);

  // Called when the user picks a project from the Projects page
  const selectProject = useCallback((proj) => {
    setProject(proj);
    try {
      if (proj) {
        localStorage.setItem('selectedProjectId', proj._id);
      } else {
        localStorage.removeItem('selectedProjectId');
      }
    } catch (e) {
      // localStorage might be full or disabled — silently ignore
    }
  }, []);

  // Called when the user deletes the currently-selected project
  const clearProject = useCallback(() => {
    setProject(null);
    try { localStorage.removeItem('selectedProjectId'); } catch (e) { /* ignore */ }
  }, []);

  // The value object that all consumers receive
  const value = {
    project,          // the currently selected project (or null)
    projectId: project ? project._id : null,  // shortcut to the id
    loading,           // true during initial restore
    selectProject,     // function to select a project
    clearProject,      // function to deselect
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

// ── Custom hook ─────────────────────────────────────────────────────────────
// Usage: const { project, projectId, selectProject } = useProject();
export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject() must be used inside a <ProjectProvider>');
  }
  return context;
}

