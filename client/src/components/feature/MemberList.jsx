// components/feature/MemberList.jsx
// List display for members with edit and delete actions.

export default function MemberList({ members, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <ul className="divide-y divide-gray-100">
        {members.map((member) => (
          <li
            key={member._id}
            className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">{member.name}</h4>
                <p className="text-xs text-gray-500">{member.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(member)}
                className="px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-200 rounded-md font-medium"
                aria-label={`Edit ${member.name}`}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(member)}
                className="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md font-medium"
                aria-label={`Delete ${member.name}`}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

