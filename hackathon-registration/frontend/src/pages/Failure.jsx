import Navbar from '../components/Navbar';

export default function Failure() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Payment failed</h1>
          <p className="text-slate-400">Something went wrong — retry options coming soon.</p>
        </div>
      </main>
    </>
  );
}
