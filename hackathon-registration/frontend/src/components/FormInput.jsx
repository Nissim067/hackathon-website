export default function FormInput({
  id,
  label,
  type = 'text',
  name,
  placeholder,
  autoComplete,
  className = '',
  ...rest
}) {
  const inputClass =
    'w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none transition ' +
    'focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30';

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-200">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputClass}
        {...rest}
      />
    </div>
  );
}
