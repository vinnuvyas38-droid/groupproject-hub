// components/feature/StatCard.jsx
// Reusable KPI metric card for the Dashboard.

export default function StatCard({ title, value, subtitle, icon, highlight = false }) {
  return (
    <div
      className={`p-5 rounded-xl border bg-white shadow-sm flex items-center justify-between transition-all hover:shadow-md ${
        highlight ? 'border-red-300 ring-1 ring-red-400 bg-red-50/20' : 'border-gray-200'
      }`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${highlight ? 'text-red-600' : 'text-gray-900'}`}>
            {value}
          </span>
          {subtitle && (
            <span className="text-xs text-gray-400 font-medium">{subtitle}</span>
          )}
        </div>
      </div>
      {icon && (
        <div className="text-3xl p-2 rounded-lg bg-gray-50 text-gray-700">
          {icon}
        </div>
      )}
    </div>
  );
}

