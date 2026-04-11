const units = [
  { value: '10', label: 'Days' },
  { value: '05', label: 'Hours' },
  { value: '20', label: 'Minutes' },
];

export default function Countdown() {
  return (
    <div className="mt-10 flex flex-col items-center gap-4">
      <p className="text-sm font-medium uppercase tracking-widest text-slate-400">
        Starts in
      </p>
      <div className="flex flex-wrap items-stretch justify-center gap-3 sm:gap-4">
        {units.map(({ value, label }) => (
          <div
            key={label}
            className="flex min-w-[4.5rem] flex-col items-center rounded-xl border border-slate-700/80 bg-slate-800/50 px-4 py-3 shadow-inner shadow-black/20"
          >
            <span className="text-2xl font-bold tabular-nums text-white sm:text-3xl">
              {value}
            </span>
            <span className="mt-1 text-xs font-medium text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
