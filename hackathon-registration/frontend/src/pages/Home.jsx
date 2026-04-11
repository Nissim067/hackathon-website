import Navbar from '../components/Navbar';
import Hero from '../components/Hero';

const prizes = [
  {
    place: '1st Prize',
    description: 'Top team — premium swag, certificates, and spotlight feature.',
  },
  {
    place: '2nd Prize',
    description: 'Runner-up — prizes and recognition across our channels.',
  },
  {
    place: '3rd Prize',
    description: 'Third place — rewards for standout execution and creativity.',
  },
];

const timeline = [
  { day: 'Day 1', title: 'Registration', detail: 'Open registration, team formation, and kickoff briefing.' },
  { day: 'Day 2', title: 'Hackathon', detail: 'Build day — mentor support, checkpoints, and submissions.' },
  { day: 'Day 3', title: 'Results', detail: 'Judging, demos, winners announced, and closing ceremony.' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navbar />
      <Hero />

      <section
        id="about"
        className="border-t border-slate-800/80 bg-slate-900 px-4 py-20"
        aria-labelledby="about-heading"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="about-heading" className="text-3xl font-bold text-white sm:text-4xl">
            About the hackathon
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            Join the AIML club for an intense weekend of building AI and ML projects. Work solo or
            with a team, learn from peers, and ship something real. Whether you are new to ML or
            polishing a portfolio piece, this is your space to experiment and compete.
          </p>
        </div>
      </section>

      <section
        className="border-t border-slate-800/80 bg-slate-950/40 px-4 py-20"
        aria-labelledby="prizes-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2 id="prizes-heading" className="text-center text-3xl font-bold text-white sm:text-4xl">
            Prizes
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {prizes.map(({ place, description }) => (
              <article
                key={place}
                className="rounded-2xl border border-slate-700/80 bg-slate-800/40 p-6 shadow-lg shadow-black/20 transition hover:border-violet-500/40 hover:bg-slate-800/60"
              >
                <h3 className="text-xl font-semibold text-violet-300">{place}</h3>
                <p className="mt-3 text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-t border-slate-800/80 bg-slate-900 px-4 py-20"
        aria-labelledby="timeline-heading"
      >
        <div className="mx-auto max-w-3xl">
          <h2 id="timeline-heading" className="text-center text-3xl font-bold text-white sm:text-4xl">
            Timeline
          </h2>
          <ol className="mt-12 space-y-0">
            {timeline.map(({ day, title, detail }, index) => (
              <li key={day} className="relative flex gap-6 pb-12 last:pb-0">
                {index < timeline.length - 1 && (
                  <span
                    className="absolute left-[0.6rem] top-8 bottom-0 w-px bg-gradient-to-b from-violet-500/50 to-slate-700"
                    aria-hidden
                  />
                )}
                <div className="relative z-10 flex h-5 w-5 shrink-0 rounded-full border-2 border-violet-500 bg-slate-900 ring-4 ring-slate-900" />
                <div className="pt-0.5">
                  <p className="text-sm font-semibold uppercase tracking-wide text-violet-400">
                    {day}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-slate-400">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
