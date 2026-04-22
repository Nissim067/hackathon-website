import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TeamSuggestions from '../components/TeamSuggestions';

// ─── Design System Tokens ───────────────────────────────────────────────────
// Assuming these are globally requested styles
const COLORS = {
  bg: '#0A0F1E',       // Main background color (deep navy)
  card: '#0D1424',     // Card background
  indigo: '#6366F1',   // Primary accent
  teal: '#06B6D4',     // Secondary accent
  textPrimary: '#F1F5F9',
  textMuted: '#94A3B8',
};

// ─── OpenTeamSkeleton ───────────────────────────────────────────────────────
// Skeleton loading state for all open teams list
function OpenTeamSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="space-y-3">
        <div className="h-5 w-2/3 rounded bg-gray-200" />
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-gray-200" />
          <div className="h-5 w-20 rounded-full bg-gray-200" />
        </div>
        <div className="h-4 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}

// ─── OpenTeamCard ───────────────────────────────────────────────────────────
// Renders an open team card in a vertical stack layout
function OpenTeamCard({ team }) {
  return (
    <div className="rounded-xl border-l-4 border-l-[#6366F1] bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* Team Name */}
      <h3 className="truncate text-lg font-bold text-gray-900">
        {team.name}
      </h3>

      {/* Skill Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(team.skills || []).map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-[#6366F1] px-2.5 py-0.5 text-xs font-medium text-white"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Capacity Info */}
      <p className="mt-3 text-sm text-gray-600">
        <span className="font-semibold" style={{ color: COLORS.teal }}>
          {team.memberCount ?? team.members?.length ?? 0}
        </span>
        {' / '}
        <span>{team.maxSize ?? 5}</span>
        {' members'}
      </p>

      {/* View Team Details Link */}
      <div className="mt-4 flex items-center justify-end">
        <Link
          to={`/teams/${team._id}`}
          className="inline-block rounded-lg px-4 py-2 text-sm font-semibold text-[#6366F1] transition-colors hover:bg-gray-50"
        >
          View Team →
        </Link>
      </div>
    </div>
  );
}

// ─── Teams Page (Main Export) ───────────────────────────────────────────────
export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [teamsError, setTeamsError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch all open teams on component mount
  useEffect(() => {
    let cancelled = false;

    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/teams', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to load teams');
        }

        const data = await res.json();
        if (!cancelled) {
          setTeams(Array.isArray(data) ? data : []);
          setTeamsError('');
        }
      } catch (err) {
        if (!cancelled) {
          setTeamsError(err.message || 'Something went wrong');
        }
      } finally {
        if (!cancelled) {
          setLoadingTeams(false);
        }
      }
    };

    fetchTeams();
    return () => { cancelled = true; };
  }, []);

  // 2. Filter teams based on search input length
  const filteredTeams = teams.filter((t) =>
    t.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Find Your Team
          </h1>
          <div className="mt-2 h-1 w-24 rounded-full" style={{ backgroundColor: COLORS.teal }} />
        </div>

        <Link
          to="/register"
          className="self-start rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
          style={{ backgroundColor: COLORS.indigo }}
        >
          + Create a Team
        </Link>
      </div>

      {/* ── Top Section: AI Suggested Teams ── */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-white">
          Suggested For You
          <span className="ml-2 text-sm font-normal text-slate-400">
            — based on your skills
          </span>
        </h2>
        <TeamSuggestions />
      </section>

      <hr className="border-gray-700/50" />

      {/* ── Middle Section: Search Input ── */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-white">All Open Teams</h2>
        
        <div className="relative mb-6">
          <svg
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
          <input
            id="team-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teams by name…"
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 shadow-sm outline-none transition-shadow duration-200 focus:border-[#6366F1] focus:shadow-md focus:ring-1 focus:ring-[#6366F1]"
          />
        </div>

        {/* ── Bottom Section: Open Teams List ── */}
        <div className="flex flex-col gap-4">
          {loadingTeams && (
            <>
              <OpenTeamSkeleton />
              <OpenTeamSkeleton />
              <OpenTeamSkeleton />
            </>
          )}

          {!loadingTeams && teamsError && (
             <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
               <p className="text-lg font-semibold text-red-600">Couldn't load teams</p>
               <p className="mt-1 text-sm text-red-500">{teamsError}</p>
             </div>
          )}

          {!loadingTeams && !teamsError && filteredTeams.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-gray-700">
                {searchQuery ? 'No teams match your search' : 'No open teams right now'}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? 'Try a different keyword.' : 'Be the first — create a team above!'}
              </p>
            </div>
          )}

          {!loadingTeams && !teamsError && filteredTeams.length > 0 && (
            filteredTeams.map((team) => (
              <OpenTeamCard key={team._id} team={team} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
