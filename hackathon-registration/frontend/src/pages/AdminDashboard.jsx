import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Create a helper to format API dates into readable local strings.
function formatDate(value) {
  // Return placeholder when date value is missing.
  if (!value) return 'N/A';
  const parsed = new Date(value);
  // Return fallback text when date cannot be parsed.
  if (Number.isNaN(parsed.getTime())) return 'N/A';
  // Return locale formatted date and time.
  return parsed.toLocaleString();
}

// Create a helper to read JWT token from common localStorage keys.
function getAuthToken() {
  // Return first available auth token value.
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('jwt') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('accessToken') ||
    ''
  );
}

// Resolve backend API base URL from environment variable.
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Create the admin dashboard page UI and data logic.
export default function AdminDashboard() {
  // Store dashboard API payload.
  const [stats, setStats] = useState(null);
  // Track loading state for first dashboard fetch.
  const [isLoading, setIsLoading] = useState(true);
  // Track fetch errors for dashboard API call.
  const [error, setError] = useState('');
  // Track export button loading state independently.
  const [isExporting, setIsExporting] = useState(false);
  // Track export action errors separately from stats fetch.
  const [exportError, setExportError] = useState('');

  // Fetch admin dashboard stats when component mounts.
  useEffect(() => {
    // Create a cancellation controller for safe unmount handling.
    const abortController = new AbortController();

    // Wrap the async fetch logic in an inner function.
    async function loadAdminStats() {
      // Set loading and reset stale errors before request.
      setIsLoading(true);
      setError('');

      try {
        // Build auth header only when token exists.
        const token = getAuthToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Request admin stats data from backend.
        const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
          method: 'GET',
          headers,
          signal: abortController.signal,
        });

        // Parse response JSON payload.
        const data = await response.json();
        // Throw explicit error when API response is not successful.
        if (!response.ok) {
          throw new Error(data?.message || 'Failed to fetch admin stats');
        }

        // Save successful response payload into state.
        setStats(data);
      } catch (fetchError) {
        // Ignore abort-related errors when component unmounts.
        if (fetchError.name === 'AbortError') return;
        // Save friendly error for UI display.
        setError(fetchError.message || 'Something went wrong while loading dashboard');
      } finally {
        // End loading state after request resolves.
        setIsLoading(false);
      }
    }

    // Trigger stats fetch on mount.
    loadAdminStats();

    // Abort in-flight request if component unmounts.
    return () => abortController.abort();
  }, []);

  // Derive top metrics and guard against missing payload fields.
  const metricData = useMemo(() => {
    const totalRegistered = Number(stats?.totalRegistered || 0);
    const totalPaid = Number(stats?.totalPaid || 0);
    const totalTeams = Number(stats?.totalTeams || 0);
    const unpaid = Math.max(totalRegistered - totalPaid, 0);

    return [
      {
        label: 'Total Registered',
        value: totalRegistered,
        borderColor: '#3B82F6',
      },
      {
        label: 'Total Paid',
        value: totalPaid,
        borderColor: '#22C55E',
      },
      {
        label: 'Total Teams',
        value: totalTeams,
        borderColor: '#6366F1',
      },
      {
        label: 'Unpaid',
        value: unpaid,
        borderColor: '#EF4444',
      },
    ];
  }, [stats]);

  // Create a CSV export handler for admin download action.
  async function handleExportCsv() {
    // Prevent duplicate export requests while one is in progress.
    if (isExporting) return;

    // Set button loading state and clear previous export errors.
    setIsExporting(true);
    setExportError('');

    try {
      // Build auth header only when token exists.
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Request CSV export from backend admin endpoint.
      const response = await fetch(`${API_BASE_URL}/api/admin/export`, {
        method: 'GET',
        headers,
      });

      // Read raw file content as blob for browser download.
      const fileBlob = await response.blob();
      // Throw error if backend rejected request.
      if (!response.ok) {
        throw new Error('Failed to export CSV');
      }

      // Build a temporary URL and anchor to trigger file download.
      const downloadUrl = URL.createObjectURL(fileBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = 'users-export.csv';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (downloadError) {
      // Save user-friendly message when export fails.
      setExportError(downloadError.message || 'CSV export failed');
    } finally {
      // End export loading state after request completes.
      setIsExporting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-[#F1F5F9]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-[#94A3B8]">Live registration and payment insights.</p>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={isExporting}
            className="rounded-lg border border-slate-500 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>

        {exportError && (
          <p className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            {exportError}
          </p>
        )}

        {isLoading && (
          <div className="rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#0D1424] p-6 text-[#94A3B8]">
            Loading admin dashboard...
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-red-300">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-8">
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metricData.map((card) => (
                <article
                  key={card.label}
                  className="rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#0D1424] p-5 transition hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                  style={{ borderTop: `4px solid ${card.borderColor}` }}
                >
                  <p className="text-3xl font-bold">{card.value}</p>
                  <p className="mt-2 text-sm text-[#94A3B8]">{card.label}</p>
                </article>
              ))}
            </section>

            <section className="rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#0D1424] p-5">
              <h2 className="mb-4 text-xl font-semibold">Registrations by College</h2>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.collegeBreakdown || []}>
                    <XAxis dataKey="college" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                    <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0D1424',
                        border: '1px solid rgba(99,102,241,0.2)',
                        color: '#F1F5F9',
                      }}
                    />
                    <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#0D1424] p-5">
              <h2 className="mb-4 text-xl font-semibold">Recent Registrations</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[rgba(99,102,241,0.2)] text-[#94A3B8]">
                      <th className="px-3 py-3 font-medium">Name</th>
                      <th className="px-3 py-3 font-medium">Email</th>
                      <th className="px-3 py-3 font-medium">College</th>
                      <th className="px-3 py-3 font-medium">Paid</th>
                      <th className="px-3 py-3 font-medium">Registered At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats?.recentRegistrations || []).slice(0, 10).map((entry, index) => (
                      <tr
                        key={`${entry.email}-${entry.createdAt}-${index}`}
                        className={index % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'}
                      >
                        <td className="px-3 py-3">{entry.name || 'N/A'}</td>
                        <td className="px-3 py-3 text-[#94A3B8]">{entry.email || 'N/A'}</td>
                        <td className="px-3 py-3">{entry.college || 'N/A'}</td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              entry.isPaid
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            {entry.isPaid ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-[#94A3B8]">{formatDate(entry.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
