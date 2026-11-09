// components/feature/TaskForm.jsx
// Form to create or update a Task with validation and dropdown selects.

import { useState, useEffect } from 'react';
import FormField from '../ui/FormField';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { validateTask, TASK_STATUSES, TASK_PRIORITIES } from '../../utils/validators';

export default function TaskForm({
  initialData = null,
  members = [],
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    status: 'To Do',
    priority: 'Medium',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        assignedTo: initialData.assignedTo?._id || initialData.assignedTo || '',
        dueDate: initialData.dueDate ? initialData.dueDate.substring(0, 10) : '',
        status: initialData.status || 'To Do',
        priority: initialData.priority || 'Medium',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        status: 'To Do',
        priority: 'Medium',
      });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      assignedTo: formData.assignedTo || null,
      dueDate: formData.dueDate || null,
    };

    const validationErrors = validateTask(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(payload);
  };

  const memberOptions = members.map((m) => ({ value: m._id, label: m.name }));
  const statusOptions = TASK_STATUSES.map((s) => ({ value: s, label: s }));
  const priorityOptions = TASK_PRIORITIES.map((p) => ({ value: p, label: p }));

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField
        label="Task Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="e.g. Implement REST API controllers"
        required
      />

      <FormField
        label="Description (optional)"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        placeholder="Details, steps, or acceptance criteria..."
        rows={3}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Assigned Member (optional)"
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          options={memberOptions}
          placeholder="Unassigned"
          error={errors.assignedTo}
        />

        <FormField
          label="Due Date (optional)"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          error={errors.dueDate}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
          error={errors.status}
          required
        />

        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={priorityOptions}
          error={errors.priority}
          required
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}

