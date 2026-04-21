import { useState } from 'react';

// ─── Site URL used in share messages ─────────────────────────────────────────
const SITE_URL = window.location.origin;

// ─── Pre-defined share text per platform ─────────────────────────────────────
const SHARE_TEXT = {
  twitter:
    'Just registered for AIML Hackathon 2026! Building the future with AI on April 24 🚀 #AIHackathon #AIML #Nexathon',
  whatsapp: `Hey! I just registered for the AIML Hackathon 2026. You should join too! Register at ${SITE_URL}`,
  linkedin:
    'Excited to participate in AIML Hackathon 2026 on April 24! Looking forward to building innovative AI solutions. #AI #Hackathon',
};

// ─── Share URL builders ──────────────────────────────────────────────────────
const SHARE_URLS = {
  twitter: (text) =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
  whatsapp: (text) =>
    `https://wa.me/?text=${encodeURIComponent(text)}`,
  linkedin: () =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}`,
};

// ─── Platform brand colours ──────────────────────────────────────────────────
const BRAND_COLORS = {
  twitter: '#000000',
  whatsapp: '#25D366',
  linkedin: '#0A66C2',
};

// ─── Inline SVG icons (simple & lightweight — no icon library needed) ────────

function TwitterIcon() {
  return (
    // "X" logo – simplified two-stroke mark
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785a9.723 9.723 0 01-4.956-1.358l-.356-.21-3.683.965.983-3.59-.232-.369A9.728 9.728 0 012.268 12c0-5.385 4.383-9.768 9.77-9.768a9.71 9.71 0 016.91 2.864 9.72 9.72 0 012.862 6.912c-.004 5.386-4.387 9.77-9.772 9.776h-.004zm5.508-18.1A11.687 11.687 0 0012.05.25C5.775.25.622 5.4.618 11.676a11.42 11.42 0 001.527 5.724L.5 23.75l6.527-1.712a11.647 11.647 0 005.557 1.416h.005c6.275 0 11.429-5.15 11.433-11.427a11.38 11.38 0 00-3.35-8.073l-.113-.069z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    // Simple chain-link icon
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  );
}

// ─── Reusable share button (used for each platform) ──────────────────────────
function ShareButton({ label, icon, bgColor, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold
                 text-white transition-all duration-200 hover:brightness-110 hover:scale-105
                 active:scale-95"
      style={{ backgroundColor: bgColor }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

// ─── Main ShareCard component ────────────────────────────────────────────────
// Props:
//   userName (string) — optional, not used in share text currently
//                       but available for future personalisation
export default function ShareCard({ userName }) {
  // Track "Copied!" feedback state
  const [copied, setCopied] = useState(false);

  // Opens a share URL in a new tab
  const openShare = (platform) => {
    const text = SHARE_TEXT[platform];
    const url = SHARE_URLS[platform](text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Copies the current page URL to the clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      // Reset "Copied!" text after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Twitter / X share button */}
      <ShareButton
        label="Twitter / X"
        icon={<TwitterIcon />}
        bgColor={BRAND_COLORS.twitter}
        onClick={() => openShare('twitter')}
      />

      {/* WhatsApp share button */}
      <ShareButton
        label="WhatsApp"
        icon={<WhatsAppIcon />}
        bgColor={BRAND_COLORS.whatsapp}
        onClick={() => openShare('whatsapp')}
      />

      {/* LinkedIn share button */}
      <ShareButton
        label="LinkedIn"
        icon={<LinkedInIcon />}
        bgColor={BRAND_COLORS.linkedin}
        onClick={() => openShare('linkedin')}
      />

      {/* Copy Link button — toggles text for 2 seconds after click */}
      <button
        type="button"
        onClick={handleCopyLink}
        className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold
                    transition-all duration-200 hover:scale-105 active:scale-95
                    ${
                      copied
                        ? 'border-emerald-500/50 bg-emerald-600/20 text-emerald-300'
                        : 'border-[#6366F1]/40 bg-[#6366F1]/10 text-[#6366F1] hover:bg-[#6366F1]/20'
                    }`}
      >
        <LinkIcon />
        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
      </button>
    </div>
  );
}
