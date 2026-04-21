import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TeamSuggestions from '../components/TeamSuggestions';

// ─── Design-system tokens ────────────────────────────────────────────────────
const COLORS = {
  bg: '#0A0F1E',
  card: '#0D1424',
  indigo: '#6366F1',
  teal: '#06B6D4',
  textPrimary: '#F1F5F9',
  textMuted: '#94A3B8',
};

// ─── Skeleton card for the "All Open Teams" section ──────────────────────────
function OpenTeamSkeleton() {
  return (
    <div
      className="animate-pulse rounded-xl border border-[#6366F1]/20 p-5"
      style={{ backgroundColor: COLORS.card }}
    >
      <div className="space-y-3">
        <div className="h-5 w-2/3 rounded bg-slate-700/50" />
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-slate-700/50" />
          <div className="h-5 w-20 rounded-full bg-slate-700/50" />
        </div>
        <div className="h-4 w-1/3 rounded bg-slate-700/50" />
      </div>
    </div>
  );
}

// ─── Single card for an open team (no match ring) ────────────────────────────
function OpenTeamCard({ team }) {
  return (
    <div
      className="group rounded-xl border border-[#6366F1]/20 border-l-4 border-l-[#6366F1] p-5
                 transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
      style={{ backgroundColor: COLORS.card }}
    >
      {/* Team name */}
      <h3
        className="truncate text-lg font-bold"
        style={{ color: COLORS.textPrimary }}
      >
        {team.name}
      </h3>

      {/* Skill pills */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(team.skills || []).map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-[#6366F1]/40 bg-[#6366F1]/20 px-2.5 py-0.5
                       text-xs font-medium text-[#6366F1]"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Member count — e.g. "3 / 5 members" */}
      <p className="mt-3 text-sm" style={{ color: COLORS.textMuted }}>
        <span className="font-semibold" style={{ color: COLORS.teal }}>
          {team.memberCount ?? team.members?.length ?? 0}
        </span>
        {' / '}
        <span>{team.maxSize ?? 5}</span>
        {' members'}
      </p>

      {/* View team link */}
      <Link
        to={`/teams/${team._id}`}
        className="mt-4 inline-block rounded-lg border border-[#6366F1]/40 px-4 py-1.5
                   text-sm font-semibold text-[#6366F1] transition-all duration-200
                   hover:bg-[#6366F1]/10 hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]"
      >
        View Team →
      </Link>
    </div>
  );
}

// ─── Main page component ─────────────────────────────────────────────────────
export default function Teams() {
  // All open teams from backend
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [teamsError, setTeamsError] = useState('');

  // Search / filter state
  const [searchQuery, setSearchQuery] = useState('');

  // ── Fetch all open teams on mount ──
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

  // ── Filter teams by search query (case-insensitive) ──
  const filteredTeams = teams.filter((t) =>
    t.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-10 pb-12">

      {/* ── Page header row ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        {/* Heading with teal underline */}
        <div>
          <h1
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            style={{ color: COLORS.textPrimary }}
          >
            Find Your Team
          </h1>
          {/* Teal accent underline */}
          <div
            className="mt-2 h-1 w-24 rounded-full"
            style={{ backgroundColor: COLORS.teal }}
          />
        </div>

        {/* "Create a Team" button — top right, indigo with glow */}
        <Link
          to="/register"
          className="self-start rounded-lg px-6 py-2.5 text-sm font-semibold text-white
                     transition-all duration-200 hover:brightness-110
                     hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
          style={{ backgroundColor: COLORS.indigo }}
        >
          + Create a Team
        </Link>
      </div>

      {/* ── Search bar ── */}
      <div className="relative">
        {/* Search icon */}
        <svg
          className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>

        <input
          id="team-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search teams by name…"
          className="w-full rounded-xl border border-[#6366F1]/20 py-3 pl-10 pr-4
                     text-sm text-white placeholder-slate-500 outline-none
                     transition-shadow duration-200
                     focus:border-[#6366F1]/50 focus:shadow-[0_0_20px_rgba(99,102,241,0.25)]"
          style={{ backgroundColor: COLORS.card }}
        />
      </div>

      {/* ── AI-suggested teams section ── */}
      <section>
        <h2
          className="mb-4 text-xl font-bold"
          style={{ color: COLORS.textPrimary }}
        >
          Suggested For You
          <span className="ml-2 text-sm font-normal" style={{ color: COLORS.textMuted }}>
            — based on your skills
          </span>
        </h2>
        <TeamSuggestions />
      </section>

      {/* ── All open teams section ── */}
      <section>
        <h2
          className="mb-4 text-xl font-bold"
          style={{ color: COLORS.textPrimary }}
        >
          All Open Teams
          {!loadingTeams && (
            <span className="ml-2 text-sm font-normal" style={{ color: COLORS.textMuted }}>
              ({filteredTeams.length} {filteredTeams.length === 1 ? 'team' : 'teams'})
            </span>
          )}
        </h2>

        {/* Loading state — 3 skeleton cards */}
        {loadingTeams && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <OpenTeamSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loadingTeams && teamsError && (
          <div
            className="rounded-xl border border-rose-500/30 p-6 text-center"
            style={{ backgroundColor: 'rgba(244,63,94,0.08)' }}
          >
            <p className="text-lg font-semibold text-rose-300">Couldn't load teams</p>
            <p className="mt-1 text-sm text-rose-200/70">{teamsError}</p>
          </div>
        )}

        {/* Empty state */}
        {!loadingTeams && !teamsError && filteredTeams.length === 0 && (
          <div
            className="rounded-xl border border-[#6366F1]/20 p-8 text-center"
            style={{ backgroundColor: COLORS.card }}
          >
            <p className="text-lg font-semibold" style={{ color: COLORS.textPrimary }}>
              {searchQuery ? 'No teams match your search' : 'No open teams right now'}
            </p>
            <p className="mt-1 text-sm" style={{ color: COLORS.textMuted }}>
              {searchQuery
                ? 'Try a different keyword.'
                : 'Be the first — create a team above!'}
            </p>
          </div>
        )}

        {/* Team cards grid */}
        {!loadingTeams && !teamsError && filteredTeams.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeams.map((team) => (
              <OpenTeamCard key={team._id} team={team} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
