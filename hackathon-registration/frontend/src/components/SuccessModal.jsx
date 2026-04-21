// Import React hooks for side effects and local UI state.
import { useEffect, useState } from 'react';
// Import celebrate helper that triggers confetti bursts.
import { celebrate } from '../utils/celebrate';

// Export the success modal component as default.
export default function SuccessModal({ isOpen, userName, teamName, onClose }) {
  // Track whether the share card is visible.
  const [isShareCardOpen, setIsShareCardOpen] = useState(false);

  // Trigger celebration every time the modal opens.
  useEffect(() => {
    // If modal is open, fire confetti and reset share card.
    if (isOpen) {
      // Run confetti animation sequence.
      celebrate();
      // Hide the share card when reopened.
      setIsShareCardOpen(false);
    }
    // Re-run this effect only when modal open state changes.
  }, [isOpen]);

  // Do not render anything when modal is closed.
  if (!isOpen) {
    // Return null to skip DOM output.
    return null;
  }

  // Build share text for social actions.
  const shareText = `I just registered for AIML Hackathon 2026${teamName ? ` with team ${teamName}` : ''}!`;
  // Build share URL using current origin.
  const shareUrl = window.location.origin;

  // Render overlay and modal content.
  return (
    // Full-screen overlay with dark backdrop.
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      {/* Modal card container. */}
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center shadow-2xl">
        {/* Success checkmark icon. */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
          {/* SVG checkmark with green stroke. */}
          <svg
            className="h-12 w-12 text-emerald-400"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Outer circle path. */}
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
            {/* Check path. */}
            <path
              d="M7.5 12.5L10.5 15.5L16.5 9.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Main heading with user name. */}
        <h2 className="mt-5 text-3xl font-bold text-white">You&apos;re in, {userName || 'Hacker'}!</h2>
        {/* Team subtitle text. */}
        <p className="mt-2 text-lg text-slate-300">Team: {teamName || 'Solo'}</p>
        {/* Email instruction message. */}
        <p className="mt-2 text-sm text-slate-400">Check your email for your QR ticket.</p>

        {/* Action buttons area. */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {/* Share button that opens the share card panel. */}
          <button
            type="button"
            onClick={() => setIsShareCardOpen(true)}
            className="w-full rounded-xl border border-indigo-500 px-4 py-3 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-500/10"
          >
            Share your registration
          </button>
          {/* Dashboard button for navigation target placeholder. */}
          <a
            href="/admin"
            className="w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Go to Dashboard
          </a>
        </div>

        {/* Conditional share card panel. */}
        {isShareCardOpen && (
          // Share card block with quick social actions.
          <div className="mt-5 rounded-xl border border-slate-700 bg-slate-800/70 p-4 text-left">
            {/* Share card heading. */}
            <p className="text-sm font-semibold text-white">ShareCard</p>
            {/* Share card helper text. */}
            <p className="mt-1 text-xs text-slate-400">Tell your friends you are participating.</p>
            {/* Social buttons row. */}
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {/* Twitter share link. */}
              <button
                type="button"
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
                className="rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-white hover:brightness-110"
              >
                Twitter
              </button>
              {/* WhatsApp share link. */}
              <button
                type="button"
                onClick={() =>
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
                className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:brightness-110"
              >
                WhatsApp
              </button>
              {/* LinkedIn share link. */}
              <button
                type="button"
                onClick={() =>
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:brightness-110"
              >
                LinkedIn
              </button>
            </div>
          </div>
        )}

        {/* Close button row. */}
        <div className="mt-5">
          {/* Close modal button. */}
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-slate-400 transition hover:text-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
