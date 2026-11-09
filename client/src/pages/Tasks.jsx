// pages/Tasks.jsx
// Complete Task management page: filter, create, edit, inline status update, and delete.

import { useState, useEffect, useCallback } from 'react';
import { useProject } from '../context/ProjectContext';
import { taskApi, memberApi } from '../services/api';
import PageHeader from '../components/layout/PageHeader';
import NoProjectPrompt from '../components/layout/NoProjectPrompt';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import Toast from '../components/ui/Toast';
import TaskForm from '../components/feature/TaskForm';
import TaskList from '../components/feature/TaskList';
import TaskFilters from '../components/feature/TaskFilters';

export default function Tasks() {
  const { projectId, project } = useProject();

  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [memberFilter, setMemberFilter] = useState('');

  // Form & Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Delete dialog
  const [deletingTask, setDeletingTask] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const queryParams = {};
      if (statusFilter) queryParams.status = statusFilter;
      if (memberFilter) queryParams.assignedTo = memberFilter;

      const [tasksRes, membersRes] = await Promise.all([
        taskApi.getAll(projectId, queryParams),
        memberApi.getAll(projectId),
      ]);

      setTasks(tasksRes.data.data || []);
      setMembers(membersRes.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [projectId, statusFilter, memberFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!projectId) {
    return <NoProjectPrompt featureName="Tasks" />;
  }

  const handleCreateNew = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setFormSubmitting(true);
    try {
      if (editingTask) {
        const res = await taskApi.update(projectId, editingTask._id, data);
        const updated = res.data.data;
        setTasks((prev) =>
          prev.map((t) => (t._id === updated._id ? updated : t))
        );
        setToast({ message: 'Task updated successfully.', type: 'success' });
      } else {
        const res = await taskApi.create(projectId, data);
        const created = res.data.data;
        setTasks((prev) => [created, ...prev]);
        setToast({ message: 'Task created.', type: 'success' });
      }
      setIsFormOpen(false);
      setEditingTask(null);
    } catch (err) {
      setToast({ message: err.message || 'Failed to save task', type: 'error' });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleInlineStatusChange = async (task, newStatus) => {
    try {
      const res = await taskApi.update(projectId, task._id, { status: newStatus });
      const updated = res.data.data;
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
      setToast({ message: `Status updated to "${newStatus}".`, type: 'info' });
    } catch (err) {
      setToast({ message: err.message || 'Could not update status', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    setDeleteSubmitting(true);
    try {
      await taskApi.delete(projectId, deletingTask._id);
      setTasks((prev) => prev.filter((t) => t._id !== deletingTask._id));
      setToast({ message: 'Task deleted.', type: 'info' });
      setDeletingTask(null);
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete task', type: 'error' });
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={`Task Manager — ${project?.name || ''}`}
        description="Track and assign tasks across your group project lifecycle."
      >
        <Button variant="primary" onClick={handleCreateNew}>
          + New Task
        </Button>
      </PageHeader>

      <ErrorMessage message={error} onRetry={fetchData} />

      {/* Task Filters */}
      <TaskFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        memberFilter={memberFilter}
        onMemberChange={setMemberFilter}
        members={members}
      />

      {loading ? (
        <Spinner size="lg" />
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          message={
            statusFilter || memberFilter
              ? 'No tasks match the active filters. Try clearing filters.'
              : 'Add your first task to start organizing project deliverables.'
          }
          actionLabel={statusFilter || memberFilter ? 'Clear Filters' : '+ Add Task'}
          onAction={() => {
            if (statusFilter || memberFilter) {
              setStatusFilter('');
              setMemberFilter('');
            } else {
              handleCreateNew();
            }
          }}
        />
      ) : (
        <TaskList
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={(t) => setDeletingTask(t)}
          onStatusChange={handleInlineStatusChange}
        />
      )}

      {/* Task Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          if (!formSubmitting) {
            setIsFormOpen(false);
            setEditingTask(null);
          }
        }}
        title={editingTask ? 'Edit Task' : 'Create Task'}
      >
        <TaskForm
          initialData={editingTask}
          members={members}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingTask(null);
          }}
          loading={formSubmitting}
        />
      </Modal>

      {/* Confirm Delete Task Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDelete}
        title="Delete Task?"
        message={`Are you sure you want to permanently delete "${deletingTask?.title}"?`}
        confirmText="Delete Task"
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
