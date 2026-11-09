// components/feature/TaskFilters.jsx
// Filter controls for task list (by Status and by Assignee Member).

import Select from '../ui/Select';
import { TASK_STATUSES } from '../../utils/validators';

export default function TaskFilters({
  statusFilter,
  onStatusChange,
  memberFilter,
  onMemberChange,
  members = [],
}) {
  const statusOptions = TASK_STATUSES.map((s) => ({ value: s, label: s }));
  const memberOptions = members.map((m) => ({ value: m._id, label: m.name }));

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex flex-col sm:flex-row items-center gap-4">
      <div className="w-full sm:w-1/2">
        <Select
          label="Filter by Status"
          name="statusFilter"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          options={statusOptions}
          placeholder="All Statuses"
        />
      </div>

      <div className="w-full sm:w-1/2">
        <Select
          label="Filter by Member"
          name="memberFilter"
          value={memberFilter}
          onChange={(e) => onMemberChange(e.target.value)}
          options={memberOptions}
          placeholder="All Members (Including Unassigned)"
        />
      </div>
    </div>
  );
}

