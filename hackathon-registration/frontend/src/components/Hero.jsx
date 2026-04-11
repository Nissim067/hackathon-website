import { Link } from 'react-router-dom';
import Countdown from './Countdown';

export default function Hero() {
  return (
    <section
      className="flex min-h-[calc(100vh-4.5rem)] flex-col items-center justify-center px-4 pb-16 pt-12 text-center"
      aria-labelledby="hero-title"
    >
      <h1
        id="hero-title"
        className="max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
      >
        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
          AIML Hackathon 2026
        </span>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-slate-300 sm:text-xl md:text-2xl">
        Build. Innovate. Dominate.
      </p>
      <Link
        to="/register"
        className="mt-10 inline-flex rounded-xl bg-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:bg-violet-500 hover:shadow-violet-800/50"
      >
        Register Now
      </Link>
      <Countdown />
    </section>
  );
}
