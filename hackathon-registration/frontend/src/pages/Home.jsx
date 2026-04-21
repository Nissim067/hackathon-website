import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const STAT_KEYS = ['registered', 'teamsFormed', 'colleges'];
const TARGET_EVENT_TIME_MS = Date.UTC(2026, 3, 24, 3, 30, 0); // Apr 24 2026, 09:00 IST

function toPositiveInt(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function formatTimeLeft(msLeft) {
  if (msLeft <= 0) {
    return null;
  }

  const totalSeconds = Math.floor(msLeft / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

export default function Home() {
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState('');
  const [realStats, setRealStats] = useState({
    registered: 0,
    teamsFormed: 0,
    colleges: 0,
  });
  const [displayStats, setDisplayStats] = useState({
    registered: 0,
    teamsFormed: 0,
    colleges: 0,
  });
  const [timeLeftMs, setTimeLeftMs] = useState(TARGET_EVENT_TIME_MS - Date.now());

  // Poll stats from backend every 10 seconds.
  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch live stats');
        }

        const data = await response.json();
        if (!isMounted) return;

        setRealStats({
          registered: toPositiveInt(data.registered),
          teamsFormed: toPositiveInt(data.teamsFormed),
          colleges: toPositiveInt(data.colleges),
        });
        setStatsError('');
      } catch (error) {
        if (!isMounted) return;
        setStatsError('Live stats are unavailable right now.');
      } finally {
        if (isMounted) {
          setLoadingStats(false);
        }
      }
    };

    fetchStats();
    const intervalId = setInterval(fetchStats, 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // Animate displayed numbers to target values every time real stats change.
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDisplayStats((prev) => {
        const next = { ...prev };
        let allDone = true;

        for (const key of STAT_KEYS) {
          const target = realStats[key];
          const current = prev[key];
          if (current < target) {
            const step = Math.max(1, Math.ceil((target - current) / 12));
            next[key] = Math.min(target, current + step);
            allDone = false;
          } else if (current > target) {
            next[key] = target;
          }
        }

        if (allDone) {
          clearInterval(intervalId);
        }

        return next;
      });
    }, 30);

    return () => clearInterval(intervalId);
  }, [realStats]);

  // Countdown timer updated every second.
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeftMs(TARGET_EVENT_TIME_MS - Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const timeParts = useMemo(() => formatTimeLeft(timeLeftMs), [timeLeftMs]);

  const openShare = (platform) => {
    const pageUrl = window.location.origin;
    const message = 'Join me at AIML Hackathon 2026 on April 24. Build. Innovate. Win.';

    const shareLinks = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(pageUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${message} ${pageUrl}`)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
    };

    const link = shareLinks[platform];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-16 pb-10">
      {/* Section 1 — Hero */}
      <section className="rounded-3xl border border-slate-700/60 bg-slate-900/60 px-6 py-14 text-center shadow-2xl shadow-black/30 sm:px-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Build. Innovate. Win.
        </h1>
        <p className="mt-4 text-lg font-medium text-slate-300 sm:text-xl">
          AIML Hackathon 2026 — April 24
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/register"
            className="rounded-xl bg-[#6366F1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Register Now
          </Link>
          <Link
            to="/teams"
            className="rounded-xl border border-[#6366F1] px-6 py-3 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-500/10"
          >
            View Teams
          </Link>
        </div>
      </section>

      {/* Section 2 — Live Stats Bar */}
      <section>
        <div className="grid gap-4 sm:grid-cols-3">
          {loadingStats
            ? [1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-2xl border border-slate-700 bg-slate-800/60"
                />
              ))
            : [
                { label: 'Registered', value: displayStats.registered },
                { label: 'Teams Formed', value: displayStats.teamsFormed },
                { label: 'Colleges', value: displayStats.colleges },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-slate-700/70 bg-slate-800/70 p-6 text-center"
                >
                  <p className="text-3xl font-bold text-[#6366F1]">{card.value}</p>
                  <p className="mt-2 text-sm font-medium text-slate-300">{card.label}</p>
                </div>
              ))}
        </div>
        {statsError && <p className="mt-3 text-sm text-rose-300">{statsError}</p>}
      </section>

      {/* Section 3 — Countdown Timer */}
      <section className="rounded-3xl border border-slate-700/60 bg-slate-900/60 px-6 py-10 text-center sm:px-10">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">Countdown to Launch</h2>
        {!timeParts ? (
          <p className="mt-6 text-xl font-semibold text-emerald-300">Hackathon is LIVE!</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'DAYS', value: timeParts.days },
              { label: 'HRS', value: timeParts.hours },
              { label: 'MIN', value: timeParts.minutes },
              { label: 'SEC', value: timeParts.seconds },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4 shadow-lg"
              >
                <p className="text-3xl font-extrabold text-white">
                  {String(item.value).padStart(2, '0')}
                </p>
                <p className="mt-1 text-xs font-semibold tracking-widest text-slate-400">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 4 — Social Share */}
      <section className="rounded-3xl border border-slate-700/60 bg-slate-900/60 px-6 py-10 sm:px-10">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">Spread the word</h2>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => openShare('twitter')}
            className="rounded-xl bg-[#1DA1F2] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Share on Twitter
          </button>
          <button
            type="button"
            onClick={() => openShare('whatsapp')}
            className="rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Share on WhatsApp
          </button>
          <button
            type="button"
            onClick={() => openShare('linkedin')}
            className="rounded-xl bg-[#0A66C2] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Share on LinkedIn
          </button>
        </div>
      </section>
    </div>
  );
}
