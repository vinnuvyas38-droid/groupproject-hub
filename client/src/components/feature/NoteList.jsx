// components/feature/NoteList.jsx
// Displays meeting notes with formatted date, attendees badges, content, and action buttons.

export default function NoteList({ notes, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div
          key={note._id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{note.title}</h3>
              <p className="text-xs text-blue-600 font-medium mt-0.5">
                📅 {new Date(note.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(note)}
                className="px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded-md font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(note)}
                className="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md font-medium"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Attendees */}
          {note.attendees && note.attendees.length > 0 && (
            <div className="mt-3 flex items-center flex-wrap gap-1.5">
              <span className="text-xs font-medium text-gray-500 mr-1">Attendees:</span>
              {note.attendees.map((attendee) => (
                <span
                  key={attendee._id || attendee}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium"
                >
                  {attendee.name || 'Member'}
                </span>
              ))}
            </div>
          )}

          {/* Note content */}
          <div className="mt-4 text-sm text-gray-700 whitespace-pre-wrap font-normal leading-relaxed">
            {note.content || <em className="text-gray-400">No meeting notes text recorded.</em>}
          </div>
        </div>
      ))}
    </div>
  );
}

