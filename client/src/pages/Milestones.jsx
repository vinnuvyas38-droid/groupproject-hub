// pages/Milestones.jsx
// Complete Milestones page for tracking major deliverables.

import { useState, useEffect, useCallback } from 'react';
import { useProject } from '../context/ProjectContext';
import { milestoneApi } from '../services/api';
import PageHeader from '../components/layout/PageHeader';
import NoProjectPrompt from '../components/layout/NoProjectPrompt';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import Toast from '../components/ui/Toast';
import MilestoneForm from '../components/feature/MilestoneForm';
import MilestoneList from '../components/feature/MilestoneList';

export default function Milestones() {
  const { projectId, project } = useProject();

  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Form & Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Delete dialog
  const [deletingMilestone, setDeletingMilestone] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const fetchMilestones = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await milestoneApi.getAll(projectId);
      setMilestones(res.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load milestones.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  if (!projectId) {
    return <NoProjectPrompt featureName="Milestones" />;
  }

  const handleCreateNew = () => {
    setEditingMilestone(null);
    setIsFormOpen(true);
  };

  const handleEdit = (ms) => {
    setEditingMilestone(ms);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setFormSubmitting(true);
    try {
      if (editingMilestone) {
        const res = await milestoneApi.update(projectId, editingMilestone._id, data);
        const updated = res.data.data;
        setMilestones((prev) =>
          prev.map((m) => (m._id === updated._id ? updated : m))
        );
        setToast({ message: 'Milestone updated.', type: 'success' });
      } else {
        const res = await milestoneApi.create(projectId, data);
        const created = res.data.data;
        setMilestones((prev) =>
          [...prev, created].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        );
        setToast({ message: 'Milestone created.', type: 'success' });
      }
      setIsFormOpen(false);
      setEditingMilestone(null);
    } catch (err) {
      setToast({ message: err.message || 'Failed to save milestone', type: 'error' });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleInlineStatusChange = async (ms, newStatus) => {
    try {
      const res = await milestoneApi.update(projectId, ms._id, { status: newStatus });
      const updated = res.data.data;
      setMilestones((prev) =>
        prev.map((m) => (m._id === updated._id ? updated : m))
      );
      setToast({ message: `Milestone status set to "${newStatus}".`, type: 'info' });
    } catch (err) {
      setToast({ message: err.message || 'Could not update status', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deletingMilestone) return;
    setDeleteSubmitting(true);
    try {
      await milestoneApi.delete(projectId, deletingMilestone._id);
      setMilestones((prev) => prev.filter((m) => m._id !== deletingMilestone._id));
      setToast({ message: 'Milestone deleted.', type: 'info' });
      setDeletingMilestone(null);
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete milestone', type: 'error' });
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={`Project Milestones — ${project?.name || ''}`}
        description="Set and monitor core deliverables, review dates, and checkpoints."
      >
        <Button variant="primary" onClick={handleCreateNew}>
          + New Milestone
        </Button>
      </PageHeader>

      <ErrorMessage message={error} onRetry={fetchMilestones} />

      {loading ? (
        <Spinner size="lg" />
      ) : milestones.length === 0 ? (
        <EmptyState
          title="No milestones defined"
          message="Define target milestones (e.g. Design Proposal, Midterm Submission, Final Presentation)."
          actionLabel="+ Add Milestone"
          onAction={handleCreateNew}
        />
      ) : (
        <MilestoneList
          milestones={milestones}
          onEdit={handleEdit}
          onDelete={(m) => setDeletingMilestone(m)}
          onStatusChange={handleInlineStatusChange}
        />
      )}

      {/* Milestone Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          if (!formSubmitting) {
            setIsFormOpen(false);
            setEditingMilestone(null);
          }
        }}
        title={editingMilestone ? 'Edit Milestone' : 'Create Milestone'}
      >
        <MilestoneForm
          initialData={editingMilestone}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingMilestone(null);
          }}
          loading={formSubmitting}
        />
      </Modal>

      {/* Delete Milestone Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingMilestone)}
        onClose={() => setDeletingMilestone(null)}
        onConfirm={handleDelete}
        title="Delete Milestone?"
        message={`Are you sure you want to permanently delete "${deletingMilestone?.title}"?`}
        confirmText="Delete Milestone"
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
