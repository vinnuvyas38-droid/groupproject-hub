// pages/Members.jsx
// Complete Members management page.

import { useState, useEffect, useCallback } from 'react';
import { useProject } from '../context/ProjectContext';
import { memberApi } from '../services/api';
import PageHeader from '../components/layout/PageHeader';
import NoProjectPrompt from '../components/layout/NoProjectPrompt';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import Toast from '../components/ui/Toast';
import MemberForm from '../components/feature/MemberForm';
import MemberList from '../components/feature/MemberList';

export default function Members() {
  const { projectId, project } = useProject();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Modal & Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Delete dialog state
  const [deletingMember, setDeletingMember] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await memberApi.getAll(projectId);
      setMembers(res.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load team members.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  if (!projectId) {
    return <NoProjectPrompt featureName="Team Members" />;
  }

  const handleCreateNew = () => {
    setEditingMember(null);
    setIsFormOpen(true);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setFormSubmitting(true);
    try {
      if (editingMember) {
        const res = await memberApi.update(projectId, editingMember._id, data);
        const updated = res.data.data;
        setMembers((prev) =>
          prev.map((m) => (m._id === updated._id ? updated : m))
        );
        setToast({ message: 'Member details updated.', type: 'success' });
      } else {
        const res = await memberApi.create(projectId, data);
        const created = res.data.data;
        setMembers((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
        setToast({ message: 'New member added to project.', type: 'success' });
      }
      setIsFormOpen(false);
      setEditingMember(null);
    } catch (err) {
      setToast({ message: err.message || 'Failed to save member', type: 'error' });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingMember) return;
    setDeleteSubmitting(true);
    try {
      await memberApi.delete(projectId, deletingMember._id);
      setMembers((prev) => prev.filter((m) => m._id !== deletingMember._id));
      setToast({ message: 'Member removed. Any assigned tasks are now unassigned.', type: 'info' });
      setDeletingMember(null);
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete member', type: 'error' });
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={`Team Members — ${project?.name || ''}`}
        description="Manage the students collaborating in this project."
      >
        <Button variant="primary" onClick={handleCreateNew}>
          + Add Member
        </Button>
      </PageHeader>

      <ErrorMessage message={error} onRetry={fetchMembers} />

      {loading ? (
        <Spinner size="lg" />
      ) : members.length === 0 ? (
        <EmptyState
          title="No members yet"
          message="Add your project group peers so you can assign tasks and mark meeting attendance."
          actionLabel="+ Add Member"
          onAction={handleCreateNew}
        />
      ) : (
        <MemberList
          members={members}
          onEdit={handleEdit}
          onDelete={(m) => setDeletingMember(m)}
        />
      )}

      {/* Member Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          if (!formSubmitting) {
            setIsFormOpen(false);
            setEditingMember(null);
          }
        }}
        title={editingMember ? 'Edit Team Member' : 'Add Team Member'}
      >
        <MemberForm
          initialData={editingMember}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingMember(null);
          }}
          loading={formSubmitting}
        />
      </Modal>

      {/* Delete Member Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingMember)}
        onClose={() => setDeletingMember(null)}
        onConfirm={handleDelete}
        title="Remove Member from Project?"
        message={`Are you sure you want to remove "${deletingMember?.name}"? Tasks assigned to them will become unassigned, and they will be removed from meeting attendance lists.`}
        confirmText="Remove Member"
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
