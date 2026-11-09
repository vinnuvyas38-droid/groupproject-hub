// pages/Notes.jsx
// Complete Meeting Notes page with live keyword text search.

import { useState, useEffect, useCallback } from 'react';
import { useProject } from '../context/ProjectContext';
import { noteApi, memberApi } from '../services/api';
import PageHeader from '../components/layout/PageHeader';
import NoProjectPrompt from '../components/layout/NoProjectPrompt';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import Toast from '../components/ui/Toast';
import NoteForm from '../components/feature/NoteForm';
import NoteList from '../components/feature/NoteList';

export default function Notes() {
  const { projectId, project } = useProject();

  const [notes, setNotes] = useState([]);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Form & Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Delete dialog
  const [deletingNote, setDeletingNote] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();

      const [notesRes, membersRes] = await Promise.all([
        noteApi.getAll(projectId, params),
        memberApi.getAll(projectId),
      ]);

      setNotes(notesRes.data.data || []);
      setMembers(membersRes.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load meeting notes.');
    } finally {
      setLoading(false);
    }
  }, [projectId, search]);

  useEffect(() => {
    // Debounce search input slightly
    const timer = setTimeout(() => {
      fetchData();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchData]);

  if (!projectId) {
    return <NoProjectPrompt featureName="Meeting Notes" />;
  }

  const handleCreateNew = () => {
    setEditingNote(null);
    setIsFormOpen(true);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setFormSubmitting(true);
    try {
      if (editingNote) {
        const res = await noteApi.update(projectId, editingNote._id, data);
        const updated = res.data.data;
        setNotes((prev) =>
          prev.map((n) => (n._id === updated._id ? updated : n))
        );
        setToast({ message: 'Meeting note updated.', type: 'success' });
      } else {
        const res = await noteApi.create(projectId, data);
        const created = res.data.data;
        setNotes((prev) => [created, ...prev]);
        setToast({ message: 'Meeting note created.', type: 'success' });
      }
      setIsFormOpen(false);
      setEditingNote(null);
    } catch (err) {
      setToast({ message: err.message || 'Failed to save note', type: 'error' });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingNote) return;
    setDeleteSubmitting(true);
    try {
      await noteApi.delete(projectId, deletingNote._id);
      setNotes((prev) => prev.filter((n) => n._id !== deletingNote._id));
      setToast({ message: 'Meeting note deleted.', type: 'info' });
      setDeletingNote(null);
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete note', type: 'error' });
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={`Meeting Notes — ${project?.name || ''}`}
        description="Archive team discussion summaries, decisions, and attendee records."
      >
        <Button variant="primary" onClick={handleCreateNew}>
          + New Meeting Note
        </Button>
      </PageHeader>

      <ErrorMessage message={error} onRetry={fetchData} />

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex items-center gap-3">
        <span className="text-gray-400 text-lg">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search meeting notes by title or keywords..."
          className="w-full text-sm focus:outline-none placeholder-gray-400"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs text-gray-500 hover:text-gray-700 font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <Spinner size="lg" />
      ) : notes.length === 0 ? (
        <EmptyState
          title={search ? 'No matching notes found' : 'No meeting notes recorded'}
          message={
            search
              ? `No notes match "${search}". Try searching for another keyword.`
              : 'Keep your student group aligned by documenting meeting discussions and decisions.'
          }
          actionLabel={search ? 'Clear Search' : '+ Record First Note'}
          onAction={() => {
            if (search) setSearch('');
            else handleCreateNew();
          }}
        />
      ) : (
        <NoteList
          notes={notes}
          onEdit={handleEdit}
          onDelete={(n) => setDeletingNote(n)}
        />
      )}

      {/* Note Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          if (!formSubmitting) {
            setIsFormOpen(false);
            setEditingNote(null);
          }
        }}
        title={editingNote ? 'Edit Meeting Note' : 'Record Meeting Note'}
      >
        <NoteForm
          initialData={editingNote}
          members={members}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingNote(null);
          }}
          loading={formSubmitting}
        />
      </Modal>

      {/* Delete Note Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingNote)}
        onClose={() => setDeletingNote(null)}
        onConfirm={handleDelete}
        title="Delete Meeting Note?"
        message={`Are you sure you want to permanently delete "${deletingNote?.title}"?`}
        confirmText="Delete Note"
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
