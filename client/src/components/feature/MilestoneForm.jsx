// components/feature/MilestoneForm.jsx
// Form to create or update project milestones with required due date.

import { useState, useEffect } from 'react';
import FormField from '../ui/FormField';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { validateMilestone, MILESTONE_STATUSES } from '../../utils/validators';

export default function MilestoneForm({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'Pending',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        dueDate: initialData.dueDate ? initialData.dueDate.substring(0, 10) : '',
        status: initialData.status || 'Pending',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        status: 'Pending',
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
    const validationErrors = validateMilestone(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  const statusOptions = MILESTONE_STATUSES.map((s) => ({ value: s, label: s }));

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField
        label="Milestone Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="e.g. Midterm Demo / Working Prototype"
        required
      />

      <FormField
        label="Description (optional)"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        placeholder="Key deliverables required for this milestone..."
        rows={3}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          error={errors.dueDate}
          required
        />

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
          error={errors.status}
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
          {initialData ? 'Update Milestone' : 'Create Milestone'}
        </Button>
      </div>
    </form>
  );
}

