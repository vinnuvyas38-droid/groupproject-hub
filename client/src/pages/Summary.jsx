// pages/Summary.jsx
// The differentiating feature page: Member Accountability Summary.
// Displays one summary card per member (completed vs outstanding vs overdue)
// plus an unassigned tasks bucket.

import { useState, useEffect, useCallback } from 'react';
import { useProject } from '../context/ProjectContext';
import { summaryApi } from '../services/api';
import PageHeader from '../components/layout/PageHeader';
import NoProjectPrompt from '../components/layout/NoProjectPrompt';
import MemberSummaryCard from '../components/feature/MemberSummaryCard';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function Summary() {
  const { projectId, project } = useProject();

  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await summaryApi.getMembers(projectId);
      setSummaryData(res.data.data);
    } catch (err) {
      setError(err.message || 'Failed to generate member summary.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  if (!projectId) {
    return <NoProjectPrompt featureName="Member Summary" />;
  }

  const members = summaryData?.members || [];
  const unassigned = summaryData?.unassigned || { outstandingCount: 0, outstandingTasks: [] };

  return (
    <div>
      <PageHeader
        title={`Member Accountability Summary — ${project?.name || ''}`}
        description="Transparent breakdown of completed deliverables, pending commitments, and highlighted overdue tasks for each student."
      />

      <ErrorMessage message={error} onRetry={fetchSummary} />

      {loading ? (
        <Spinner size="lg" />
      ) : members.length === 0 ? (
        <EmptyState
          title="No member activity data yet"
          message="Add team members and assign tasks to see live accountability summaries."
        />
      ) : (
        <div className="space-y-8">
          {/* Member Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((m) => (
              <MemberSummaryCard key={m.member._id} memberData={m} />
            ))}
          </div>

          {/* Unassigned Work Bucket (Nothing hidden) */}
          {unassigned.outstandingCount > 0 && (
            <div className="bg-amber-50/50 rounded-xl border border-amber-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">⚠️</span>
                <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider">
                  Unassigned Commitments ({unassigned.outstandingCount} Tasks Pending)
                </h3>
              </div>
              <p className="text-xs text-amber-700 mb-4">
                These tasks belong to the project workspace but have not yet been claimed or assigned to any team member.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {unassigned.outstandingTasks.map((task) => (
                  <div
                    key={task._id}
                    className={`p-3 rounded-lg border text-xs bg-white shadow-xs ${
                      task.isOverdue ? 'border-red-300 text-red-900' : 'border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="font-semibold truncate mb-1" title={task.title}>
                      {task.title}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span>Status: {task.status}</span>
                      {task.dueDate && (
                        <span className={task.isOverdue ? 'text-red-600 font-bold' : ''}>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                          {task.isOverdue && ' (Overdue)'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
