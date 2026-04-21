import FormInput from '../components/FormInput';
import TeamSection from '../components/TeamSection';
import PaymentButton from '../components/PaymentButton';

const selectClass =
  'w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-2.5 text-slate-100 outline-none transition ' +
  'focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30';

export default function Register() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Register
        </h1>
        <p className="mt-2 text-slate-400">Complete your details to join the hackathon.</p>
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-md sm:p-8">
        <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
              <section className="space-y-5">
                <h2 className="border-b border-slate-700 pb-2 text-lg font-semibold text-white">
                  Personal info
                </h2>
                <FormInput
                  id="fullName"
                  name="fullName"
                  label="Full name"
                  placeholder="Your name as on ID"
                  autoComplete="name"
                />
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="you@college.edu"
                  autoComplete="email"
                />
                <FormInput
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Phone"
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />
              </section>

              <section className="space-y-5">
                <h2 className="border-b border-slate-700 pb-2 text-lg font-semibold text-white">
                  Academic info
                </h2>
                <FormInput
                  id="college"
                  name="college"
                  label="College"
                  placeholder="Institution name"
                  autoComplete="organization"
                />
                <FormInput
                  id="branch"
                  name="branch"
                  label="Branch"
                  placeholder="e.g. CSE, AIML"
                />
                <div className="space-y-2">
                  <label htmlFor="year" className="block text-sm font-medium text-slate-200">
                    Year
                  </label>
                  <select id="year" name="year" className={selectClass}>
                    <option value="">Select year</option>
                    <option value="1">1st year</option>
                    <option value="2">2nd year</option>
                    <option value="3">3rd year</option>
                    <option value="4">4th year</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </section>

              <TeamSection />

              <section className="space-y-4 rounded-xl border border-slate-700/60 bg-slate-900/40 p-5">
                <h2 className="text-lg font-semibold text-white">Payment</h2>
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-700/80 pb-4">
                  <span className="text-slate-300">Entry fee</span>
                  <span className="text-2xl font-bold text-violet-300">₹100</span>
                </div>
                <p className="text-sm text-slate-500">Secure payment via gateway</p>
                <div className="pt-2">
                  <PaymentButton />
                </div>
              </section>
        </form>
      </div>
    </div>
  );
}
