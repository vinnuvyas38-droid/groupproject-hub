// pages/Projects.jsx
// Complete Projects management page: list, create, edit, delete, and select active project.

import { useState, useEffect, useCallback } from 'react';
import { projectApi } from '../services/api';
import { useProject } from '../context/ProjectContext';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import Toast from '../components/ui/Toast';
import ProjectForm from '../components/feature/ProjectForm';

export default function Projects() {
  const { project: activeProject, selectProject, clearProject } = useProject();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Delete dialog state
  const [deletingProject, setDeletingProject] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await projectApi.getAll();
      setProjects(res.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateNew = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (p) => {
    setEditingProject(p);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setFormSubmitting(true);
    try {
      if (editingProject) {
        const res = await projectApi.update(editingProject._id, data);
        const updated = res.data.data;
        setProjects((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p))
        );
        if (activeProject?._id === updated._id) {
          selectProject(updated);
        }
        setToast({ message: 'Project updated successfully!', type: 'success' });
      } else {
        const res = await projectApi.create(data);
        const created = res.data.data;
        setProjects((prev) => [created, ...prev]);
        selectProject(created); // Auto-select newly created project
        setToast({ message: 'Project created and selected!', type: 'success' });
      }
      setIsFormOpen(false);
      setEditingProject(null);
    } catch (err) {
      setToast({ message: err.message || 'Failed to save project', type: 'error' });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProject) return;
    setDeleteSubmitting(true);
    try {
      await projectApi.delete(deletingProject._id);
      setProjects((prev) => prev.filter((p) => p._id !== deletingProject._id));
      if (activeProject?._id === deletingProject._id) {
        clearProject();
      }
      setToast({ message: 'Project and all related data deleted.', type: 'info' });
      setDeletingProject(null);
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete project', type: 'error' });
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Project Workspaces"
        description="Select an active project or create a new team workspace."
      >
        <Button variant="primary" onClick={handleCreateNew}>
          + New Project
        </Button>
      </PageHeader>

      <ErrorMessage message={error} onRetry={fetchProjects} />

      {loading ? (
        <Spinner size="lg" />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects found"
          message="Create your first team project workspace to start tracking tasks and notes."
          actionLabel="+ Create Project"
          onAction={handleCreateNew}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => {
            const isSelected = activeProject?._id === p._id;
            return (
              <div
                key={p._id}
                className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between transition-all hover:shadow-md ${
                  isSelected ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-gray-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 truncate" title={p.name}>
                      {p.name}
                    </h3>
                    {isSelected && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {p.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                  <Button
                    variant={isSelected ? 'secondary' : 'primary'}
                    onClick={() => selectProject(p)}
                    className="text-xs py-1.5"
                  >
                    {isSelected ? '✓ Selected' : 'Select'}
                  </Button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded-md font-medium"
                      aria-label="Edit project"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingProject(p)}
                      className="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md font-medium"
                      aria-label="Delete project"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Create/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          if (!formSubmitting) {
            setIsFormOpen(false);
            setEditingProject(null);
          }
        }}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
      >
        <ProjectForm
          initialData={editingProject}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingProject(null);
          }}
          loading={formSubmitting}
        />
      </Modal>

      {/* Confirm Delete Project Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingProject)}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleDelete}
        title="Delete Project Workspace?"
        message={`Are you sure you want to delete "${deletingProject?.name}"? All related members, tasks, meeting notes, and milestones will be permanently removed.`}
        confirmText="Delete Project"
        loading={deleteSubmitting}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}
