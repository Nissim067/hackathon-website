export default function Failure() {
  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-8 text-center shadow-lg">
      <h1 className="text-3xl font-bold text-white">Payment failed</h1>
      <p className="mt-2 text-slate-300">Something went wrong — retry options coming soon.</p>
    </div>
  );
}
