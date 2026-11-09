// components/ui/Badge.jsx
// A small coloured label used to show status or priority.
// Colours change based on the value.

// Colour mappings for task statuses
const STATUS_COLOURS = {
  'To Do':       'bg-gray-100 text-gray-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Done':        'bg-green-100 text-green-700',
  'Pending':     'bg-yellow-100 text-yellow-700',
  'Completed':   'bg-green-100 text-green-700',
};

// Colour mappings for task priorities
const PRIORITY_COLOURS = {
  'Low':    'bg-gray-100 text-gray-600',
  'Medium': 'bg-orange-100 text-orange-700',
  'High':   'bg-red-100 text-red-700',
};

export default function Badge({ value, type = 'status' }) {
  const colourMap = type === 'priority' ? PRIORITY_COLOURS : STATUS_COLOURS;
  const colours = colourMap[value] || 'bg-gray-100 text-gray-700';

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colours}`}>
      {value}
    </span>
  );
}

