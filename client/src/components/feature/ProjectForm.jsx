// components/feature/ProjectForm.jsx
// Form to create or edit a project with inline error handling.

import { useState, useEffect } from 'react';
import FormField from '../ui/FormField';
import Button from '../ui/Button';
import { validateProject } from '../../utils/validators';

export default function ProjectForm({ initialData = null, onSubmit, onCancel, loading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
      });
    } else {
      setFormData({ name: '', description: '' });
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
    const validationErrors = validateProject(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField
        label="Project Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="e.g. Distributed Computing Term Project"
        required
      />

      <FormField
        label="Description (optional)"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        placeholder="Brief summary of project scope, goals, or guidelines..."
        rows={4}
      />

      <div className="flex justify-end gap-3 mt-6">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}

