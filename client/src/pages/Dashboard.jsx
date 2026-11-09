// pages/Dashboard.jsx
// Complete project overview dashboard displaying task breakdown, overdue count,
// next upcoming deadlines, and milestones.

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { dashboardApi } from '../services/api';
import PageHeader from '../components/layout/PageHeader';
import NoProjectPrompt from '../components/layout/NoProjectPrompt';
import StatCard from '../components/feature/StatCard';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function Dashboard() {
  const { projectId, project } = useProject();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardApi.get(projectId);
      setData(res.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load project dashboard.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (!projectId) {
    return <NoProjectPrompt featureName="Dashboard" />;
  }

  const taskCounts = data?.taskCounts || { 'To Do': 0, 'In Progress': 0, 'Done': 0, total: 0 };
  const overdueCount = data?.overdueCount || 0;
  const upcomingTasks = data?.upcomingTasks || [];
  const upcomingMilestones = data?.upcomingMilestones || [];

  return (
    <div>
      <PageHeader
        title={`Dashboard — ${project?.name || ''}`}
        description="Live status overview, upcoming deadlines, and team deliverables."
      >
        <Link to="/summary">
          <Button variant="primary">View Member Accountability ➔</Button>
        </Link>
      </PageHeader>

      <ErrorMessage message={error} onRetry={fetchDashboard} />

      {loading ? (
        <Spinner size="lg" />
      ) : (
        <div className="space-y-8">
          {/* Top KPI Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Tasks"
              value={taskCounts.total}
              subtitle={`${taskCounts['Done']} completed`}
              icon="📋"
            />
            <StatCard
              title="In Progress"
              value={taskCounts['In Progress']}
              subtitle={`${taskCounts['To Do']} pending`}
              icon="⏳"
            />
            <StatCard
              title="Overdue Tasks"
              value={overdueCount}
              subtitle="Requires immediate attention"
              icon="⚠️"
              highlight={overdueCount > 0}
            />
            <StatCard
              title="Team Members"
              value={data?.memberCount || 0}
              subtitle={`${data?.noteCount || 0} meeting notes recorded`}
              icon="👥"
            />
          </div>

          {/* Detailed Lists: Next 5 Upcoming Tasks & Next 5 Upcoming Milestones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Deadlines (Tasks) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 text-base flex items-center gap-2">
                    <span>⏰</span> Next Upcoming Deadlines
                  </h3>
                  <Link to="/tasks" className="text-xs text-blue-600 hover:underline font-medium">
                    All Tasks ➔
                  </Link>
                </div>

                {upcomingTasks.length === 0 ? (
                  <p className="text-sm text-gray-400 py-6 text-center italic">
                    No upcoming task deadlines scheduled.
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {upcomingTasks.map((t) => (
                      <li key={t._id} className="py-3 flex items-center justify-between gap-3">
                        <div className="truncate">
                          <p className="text-sm font-medium text-gray-800 truncate" title={t.title}>
                            {t.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            Assignee: <span className="text-gray-600">{t.assignee || 'Unassigned'}</span>
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No date'}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Upcoming Milestones */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 text-base flex items-center gap-2">
                    <span>🎯</span> Upcoming Project Milestones
                  </h3>
                  <Link to="/milestones" className="text-xs text-blue-600 hover:underline font-medium">
                    All Milestones ➔
                  </Link>
                </div>

                {upcomingMilestones.length === 0 ? (
                  <p className="text-sm text-gray-400 py-6 text-center italic">
                    No future milestones pending.
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {upcomingMilestones.map((m) => (
                      <li key={m._id} className="py-3 flex items-center justify-between gap-3">
                        <div className="truncate">
                          <p className="text-sm font-medium text-gray-800 truncate" title={m.title}>
                            {m.title}
                          </p>
                          <span className="inline-block mt-0.5">
                            <Badge value={m.status} type="status" />
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                            {new Date(m.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
