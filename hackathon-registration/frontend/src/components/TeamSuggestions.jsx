import { useEffect, useState } from 'react';

// ─── SVG Ring Constants ──────────────────────────────────────────────────────
// The ring is an SVG circle with radius 40.
// Circumference = 2 × π × 40 ≈ 251.33  — used for the dash-offset trick.
const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// ─── Helper: choose the ring colour based on match quality ───────────────────
function getRingColor(pct) {
  if (pct >= 75) return '#22C55E'; // green  — strong match
  if (pct >= 50) return '#3B82F6'; // blue   — decent match
  return '#9CA3AF';                // gray   — weak match
}

// ─── MatchRing ───────────────────────────────────────────────────────────────
// Circular SVG ring that visually represents matchPercent.
// The coloured arc fills clockwise from the top (12-o'clock).
function MatchRing({ percent }) {
  const color = getRingColor(percent);
  // offset = how much of the ring is *hidden*
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

  return (
    <svg width="90" height="90" className="shrink-0">
      {/* 1. Gray background track */}
      <circle
        cx="45"
        cy="45"
        r={RADIUS}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="6"
      />

      {/* 2. Coloured progress arc */}
      <circle
        cx="45"
        cy="45"
        r={RADIUS}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        transform="rotate(-90 45 45)"
        className="transition-all duration-700"
      />

      {/* 3. Percentage number centred inside */}
      <text
        x="45"
        y="45"
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

// ─── SkeletonCard ────────────────────────────────────────────────────────────
// Pulsing placeholder shown while the API call is in progress.
// Mimics the real card layout so the page doesn't jump when data arrives.
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border-l-4 border-l-[#6366F1] bg-white p-5 shadow-sm">
      <div className="flex gap-4">
        {/* Fake ring placeholder */}
        <div className="h-[90px] w-[90px] shrink-0 rounded-full bg-gray-200" />

        <div className="flex-1 space-y-3 py-2">
          {/* Fake title bar */}
          <div className="h-5 w-2/3 rounded bg-gray-200" />

          {/* Fake skill pills */}
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-full bg-gray-200" />
            <div className="h-5 w-20 rounded-full bg-gray-200" />
            <div className="h-5 w-14 rounded-full bg-gray-200" />
          </div>

          {/* Fake reason lines */}
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-4/5 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

// ─── SuggestionCard ──────────────────────────────────────────────────────────
// Renders one team-match result.
// Contains: match ring, team name, skill pills, match reasons, join button.
function SuggestionCard({ team }) {
  // Button state: idle → loading → sent
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // POST /api/teams/:id/request — ask to join this team
  const handleJoinRequest = async () => {
    setLoading(true);
    setError('');

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

      // Mark this card as "sent" so the button stays disabled
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border-l-4 border-l-[#6366F1] bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* ── Card body: ring on the left, details on the right ── */}
      <div className="flex gap-5">
        {/* 1. Circular match-percentage ring */}
        <MatchRing percent={team.matchPercent ?? 0} />

        {/* 2–4. Team info column */}
        <div className="min-w-0 flex-1 space-y-3">
          {/* 2. Team name — bold */}
          <h3 className="truncate text-lg font-bold text-gray-900">
            {team.name}
          </h3>

          {/* 3. Skill pill badges — indigo bg, white text */}
          <div className="flex flex-wrap gap-1.5">
            {(team.skills || []).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-[#6366F1] px-2.5 py-0.5 text-xs font-medium text-white"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* 4. Match reasons — first 2 bullet points */}
          <ul className="space-y-1">
            {(team.reasons || []).slice(0, 2).map((reason, idx) => (
              <li
                key={idx}
                className="flex items-start gap-1.5 text-sm text-gray-600"
              >
                <span className="mt-0.5 text-[#6366F1]">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── 5. "Request to Join" / "Sent!" button ── */}
      <div className="mt-4 flex items-center justify-end gap-3">
        {/* Show error if the request failed */}
        {error && <span className="text-xs text-red-500">{error}</span>}

        <button
          type="button"
          disabled={sent || loading}
          onClick={handleJoinRequest}
          className={`rounded-lg px-5 py-2 text-sm font-semibold text-white transition-all duration-200
            ${sent
              ? 'cursor-default bg-green-500'
              : 'bg-[#6366F1] hover:bg-indigo-500'
            }
            disabled:opacity-60`}
        >
          {sent ? 'Sent!' : loading ? 'Sending…' : 'Request to Join'}
        </button>
      </div>
    </div>
  );
}

// ─── TeamSuggestions (main export) ───────────────────────────────────────────
// Fetches GET /api/teams/suggested on mount and renders up to 3 suggestion
// cards in a vertical stack. Handles loading, error, and empty states.
export default function TeamSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch suggested teams once when the component mounts
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
          // API returns an array — cap at 3 cards max
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

    // Cleanup: prevent state updates if the component unmounts mid-fetch
    return () => { cancelled = true; };
  }, []);

  // ── Loading state: 3 animated skeleton cards ──
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // ── Error state: friendly message ──
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-lg font-semibold text-red-600">Oops!</p>
        <p className="mt-1 text-sm text-red-500">{error}</p>
        <p className="mt-3 text-xs text-gray-400">
          Please try refreshing the page or check back later.
        </p>
      </div>
    );
  }

  // ── Empty state: no suggestions available ──
  if (suggestions.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-gray-700">
          No suggestions yet
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Complete your profile to get personalised team matches.
        </p>
      </div>
    );
  }

  // ── Suggestion cards — vertical stack, max 3 ──
  return (
    <div className="flex flex-col gap-4">
      {suggestions.map((team) => (
        <SuggestionCard key={team._id} team={team} />
      ))}
    </div>
  );
}
