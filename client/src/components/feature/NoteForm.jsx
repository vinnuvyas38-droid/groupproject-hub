// components/feature/NoteForm.jsx
// Form to record or edit meeting notes with attendee multi-select checkboxes.

import { useState, useEffect } from 'react';
import FormField from '../ui/FormField';
import Button from '../ui/Button';
import { validateNote } from '../../utils/validators';

export default function NoteForm({
  initialData = null,
  members = [],
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    content: '',
    attendees: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        date: initialData.date ? initialData.date.substring(0, 10) : '',
        content: initialData.content || '',
        attendees: (initialData.attendees || []).map((a) => (typeof a === 'object' ? a._id : a)),
      });
    } else {
      // Default date to today's date
      const todayStr = new Date().toISOString().substring(0, 10);
      setFormData({
        title: '',
        date: todayStr,
        content: '',
        attendees: [],
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

  const handleAttendeeToggle = (memberId) => {
    setFormData((prev) => {
      const exists = prev.attendees.includes(memberId);
      const updated = exists
        ? prev.attendees.filter((id) => id !== memberId)
        : [...prev.attendees, memberId];
      return { ...prev, attendees: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateNote(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField
        label="Meeting Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="e.g. Sprint 2 Planning & Architecture Review"
        required
      />

      <FormField
        label="Meeting Date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        error={errors.date}
        required
      />

      <FormField
        label="Meeting Notes & Decisions"
        name="content"
        type="textarea"
        value={formData.content}
        onChange={handleChange}
        error={errors.content}
        placeholder="Discussion points, decisions made, action items agreed upon..."
        rows={6}
      />

      {/* Attendees selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attendees Present ({formData.attendees.length} selected)
        </label>
        {members.length === 0 ? (
          <p className="text-xs text-gray-500 italic">
            No team members added yet. Add members in the Members tab to record attendance.
          </p>
        ) : (
          <div className="max-h-36 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50/50">
            {members.map((member) => {
              const checked = formData.attendees.includes(member._id);
              return (
                <label
                  key={member._id}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none hover:text-gray-900"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleAttendeeToggle(member._id)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>{member.name}</span>
                  <span className="text-xs text-gray-400">({member.email})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Update Note' : 'Save Meeting Note'}
        </Button>
      </div>
    </form>
  );
}

