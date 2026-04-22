import { useEffect, useState } from 'react';

// ─── Design-system tokens (keep central so every dev uses the same values) ───
const COLORS = {
  bg: '#0A0F1E',
  card: '#0D1424',
  indigo: '#6366F1',
  teal: '#06B6D4',
  green: '#1D9E75',
  textPrimary: '#F1F5F9',
  textMuted: '#94A3B8',
};

// ─── Helper: pick the ring colour based on the match percentage ──────────────
function ringColor(pct) {
  if (pct >= 75) return COLORS.green;
  if (pct >= 50) return COLORS.indigo;
  return COLORS.textMuted; // gray for weak matches
}

// ─── SVG circular progress ring ──────────────────────────────────────────────
// radius = 40, circumference = 2 * π * 40 ≈ 251.33
const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function MatchRing({ percent }) {
  const color = ringColor(percent);
  // How much of the ring should be filled
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

  return (
    <svg width="96" height="96" className="shrink-0">
      {/* Background track */}
      <circle
        cx="48"
        cy="48"
        r={RADIUS}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="6"
      />
      {/* Coloured progress arc */}
      <circle
        cx="48"
        cy="48"
        r={RADIUS}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        transform="rotate(-90 48 48)" // start from 12-o'clock
        className="transition-all duration-700"
      />
      {/* Percentage number centred inside the ring */}
      <text
        x="48"
        y="48"
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize="18"
        fontWeight="700"
      >
        {percent}%
      </text>
    </svg>
  );
}

// ─── Skeleton card shown while data is loading ───────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="animate-pulse rounded-xl border border-[#6366F1]/20 border-l-4 border-l-[#6366F1] p-5"
      style={{ backgroundColor: COLORS.card }}
    >
      <div className="flex gap-4">
        {/* Fake ring */}
        <div className="h-24 w-24 shrink-0 rounded-full bg-slate-700/50" />
        <div className="flex-1 space-y-3 py-2">
          {/* Fake title */}
          <div className="h-5 w-2/3 rounded bg-slate-700/50" />
          {/* Fake pills */}
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-full bg-slate-700/50" />
            <div className="h-5 w-20 rounded-full bg-slate-700/50" />
            <div className="h-5 w-14 rounded-full bg-slate-700/50" />
          </div>
          {/* Fake text lines */}
          <div className="h-4 w-full rounded bg-slate-700/50" />
          <div className="h-4 w-4/5 rounded bg-slate-700/50" />
        </div>
      </div>
    </div>
  );
}

// ─── Single suggestion card ──────────────────────────────────────────────────
function SuggestionCard({ team }) {
  const [requesting, setRequesting] = useState(false);
  const [sent, setSent] = useState(false);
  const [requestError, setRequestError] = useState('');

  // Send join-request to backend
  const handleJoinRequest = async () => {
    setRequesting(true);
    setRequestError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/teams/${team._id}/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Request failed');
      }

      setSent(true); // success!
    } catch (err) {
      setRequestError(err.message);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div
      className="group rounded-xl border border-[#6366F1]/20 border-l-4 border-l-[#6366F1] p-5
                 transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
      style={{ backgroundColor: COLORS.card }}
    >
      {/* Top row: ring + info */}
      <div className="flex gap-5">
        {/* Match ring */}
        <MatchRing percent={team.matchPercent ?? 0} />

        {/* Team info */}
        <div className="min-w-0 flex-1 space-y-3">
          {/* Team name */}
          <h3 className="truncate text-lg font-bold" style={{ color: COLORS.textPrimary }}>
            {team.name}
          </h3>

          {/* Skill pills */}
          <div className="flex flex-wrap gap-1.5">
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

          {/* Match reasons (first 2 only) */}
          <ul className="space-y-1">
            {(team.reasons || []).slice(0, 2).map((reason, idx) => (
              <li
                key={idx}
                className="flex items-start gap-1.5 text-sm"
                style={{ color: COLORS.teal }}
              >
                <span className="mt-0.5">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Join button */}
      <div className="mt-4 flex items-center justify-end gap-3">
        {requestError && (
          <span className="text-xs text-rose-400">{requestError}</span>
        )}

        <button
          type="button"
          disabled={sent || requesting}
          onClick={handleJoinRequest}
          className={`rounded-lg px-5 py-2 text-sm font-semibold text-white transition-all duration-200
            ${sent
              ? 'cursor-default bg-emerald-600/80'
              : 'bg-[#6366F1] hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]'
            }
            disabled:opacity-60`}
        >
          {/* Loading spinner */}
          {requesting && (
            <svg
              className="-ml-1 mr-2 inline h-4 w-4 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {sent ? 'Request Sent ✓' : requesting ? 'Sending…' : 'Request to Join'}
        </button>
      </div>
    </div>
  );
}

// ─── Main exported component ─────────────────────────────────────────────────
export default function TeamSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch suggested teams on mount
  useEffect(() => {
    let cancelled = false;

    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/teams/suggested', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Could not load team suggestions');
        }

        const data = await res.json();
        if (!cancelled) {
          // Show at most 3 suggestions
          setSuggestions(Array.isArray(data) ? data.slice(0, 3) : []);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Something went wrong');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchSuggestions();
    return () => { cancelled = true; };
  }, []);

  // ── Loading state: 3 pulsing skeleton cards ──
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // ── Error state: friendly message ──
  if (error) {
    return (
      <div
        className="rounded-xl border border-rose-500/30 p-6 text-center"
        style={{ backgroundColor: 'rgba(244,63,94,0.08)' }}
      >
        <p className="text-lg font-semibold text-rose-300">Oops!</p>
        <p className="mt-1 text-sm text-rose-200/70">{error}</p>
        <p className="mt-3 text-xs text-slate-400">
          Please try refreshing the page or check back later.
        </p>
      </div>
    );
  }

  // ── Empty state ──
  if (suggestions.length === 0) {
    return (
      <div
        className="rounded-xl border border-[#6366F1]/20 p-8 text-center"
        style={{ backgroundColor: COLORS.card }}
      >
        <p className="text-lg font-semibold" style={{ color: COLORS.textPrimary }}>
          No suggestions yet
        </p>
        <p className="mt-1 text-sm" style={{ color: COLORS.textMuted }}>
          Complete your profile to get personalised team matches.
        </p>
      </div>
    );
  }

  // ── Suggestion cards ──
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {suggestions.map((team) => (
        <SuggestionCard key={team._id} team={team} />
      ))}
    </div>
  );
}
