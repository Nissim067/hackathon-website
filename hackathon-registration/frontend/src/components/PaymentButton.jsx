export default function PaymentButton({ disabled = false, type = 'submit', ...rest }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={
        'w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-violet-900/40 transition ' +
        'hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-violet-800/50 ' +
        'focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-900 ' +
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none'
      }
      {...rest}
    >
      Pay &amp; Register
    </button>
  );
}
