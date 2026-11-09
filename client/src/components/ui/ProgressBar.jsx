// components/ui/ProgressBar.jsx
// A horizontal progress bar used on the Member Summary page.
// Shows a percentage fill with a colour that changes based on completion.

export default function ProgressBar({ percent = 0 }) {
  // Pick a colour based on how complete the bar is
  let barColour = 'bg-red-500';        // 0-33%  — danger / behind
  if (percent >= 66) barColour = 'bg-green-500';  // 66-100% — on track
  else if (percent >= 33) barColour = 'bg-yellow-500'; // 33-66% — making progress

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5" aria-label={`${percent}% complete`}>
      <div
        className={`${barColour} h-2.5 rounded-full transition-all duration-300`}
        style={{ width: `${Math.min(percent, 100)}%` }} // cap at 100%
      />
    </div>
  );
}

