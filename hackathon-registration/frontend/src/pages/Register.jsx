import { useMemo, useState } from 'react';

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300';
const labelClass = 'mb-2 block text-sm font-semibold text-slate-700';
const errorClass = 'mt-1 text-xs font-medium text-red-500';
const skillOptions = ['React', 'Node.js', 'Python', 'TensorFlow', 'Figma', 'MongoDB'];

export default function Register({ onSuccess = () => {} }) {
  // Step state for multi-step form flow.
  const [currentStep, setCurrentStep] = useState(1);
  // Loading state for final submit.
  const [isSubmitting, setIsSubmitting] = useState(false);
  // General request error state.
  const [requestError, setRequestError] = useState('');
  // Inline field validation errors.
  const [errors, setErrors] = useState({});
  // Form state covering all 3 steps.
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    collegeName: '',
    yearOfStudy: '',
    branch: '',
    role: '',
    skills: [],
    experience: '',
  });

  // Progress percentage shown in the top progress bar.
  const progressWidth = useMemo(() => `${(currentStep / 3) * 100}%`, [currentStep]);

  // Generic state update helper for text/select/radio fields.
  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Toggle helper for skill checkbox selections.
  const toggleSkill = (skill) => {
    setFormData((prev) => {
      const hasSkill = prev.skills.includes(skill);
      const nextSkills = hasSkill ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill];
      return { ...prev, skills: nextSkills };
    });
    setErrors((prev) => ({ ...prev, skills: '' }));
  };

  // Validate step 1 fields.
  const validateStep1 = () => {
    const nextErrors = {};
    if (!formData.fullName.trim()) nextErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address';
    }
    if (!formData.phone.trim()) {
      nextErrors.phone = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      nextErrors.phone = 'Phone Number must be exactly 10 digits';
    }
    return nextErrors;
  };

  // Validate step 2 fields.
  const validateStep2 = () => {
    const nextErrors = {};
    if (!formData.collegeName.trim()) nextErrors.collegeName = 'College Name is required';
    if (!formData.yearOfStudy) nextErrors.yearOfStudy = 'Year of Study is required';
    if (!formData.branch.trim()) nextErrors.branch = 'Branch is required';
    return nextErrors;
  };

  // Validate step 3 fields.
  const validateStep3 = () => {
    const nextErrors = {};
    if (!formData.role) nextErrors.role = 'Role is required';
    if (!formData.experience) nextErrors.experience = 'Experience is required';
    if (formData.skills.length < 1) nextErrors.skills = 'Select at least one skill';
    return nextErrors;
  };

  // Route step validation based on current step.
  const getCurrentStepErrors = () => {
    if (currentStep === 1) return validateStep1();
    if (currentStep === 2) return validateStep2();
    return validateStep3();
  };

  // Handle next step with validation.
  const handleNext = () => {
    const stepErrors = getCurrentStepErrors();
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  // Handle previous step without validation.
  const handleBack = () => {
    setRequestError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Final submit handler for step 3.
  const handleSubmit = async () => {
    const stepErrors = validateStep3();
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;

    setRequestError('');
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        college: formData.collegeName,
        branch: formData.branch,
        year: formData.yearOfStudy,
        teamType: 'solo'
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const userName = data.user?.name || formData.fullName;
      const teamName = data.team?.teamName || data.teamName || 'Solo';
      onSuccess(userName, teamName);
    } catch (error) {
      setRequestError(error.message || 'Unable to complete registration right now');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reusable step marker component for progress indicator.
  const StepMarker = ({ stepNumber, label }) => {
    const isDone = currentStep > stepNumber;
    const isActive = currentStep === stepNumber;

    return (
      <div className="flex items-center gap-2">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
            isDone
              ? 'bg-emerald-500 text-white'
              : isActive
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-300 text-slate-700'
          }`}
        >
          {isDone ? '✓' : stepNumber}
        </div>
        <span className="text-xs font-semibold text-slate-500 sm:text-sm">{label}</span>
      </div>
    );
  };

  return (
    // Main registration page wrapper.
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Header section for title and intro text. */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-100 sm:text-4xl">Hackathon Registration</h1>
        <p className="mt-2 text-sm text-slate-400 sm:text-base">
          Complete all 3 steps to confirm your registration.
        </p>
      </div>

      {/* Card container for multi-step form. */}
      <div className="rounded-2xl border border-indigo-500/20 bg-white p-6 shadow-xl sm:p-8">
        {/* Step count and progress bar area. */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">Step {currentStep} of 3</p>
            <div className="hidden items-center gap-4 sm:flex">
              <StepMarker stepNumber={1} label="Personal" />
              <StepMarker stepNumber={2} label="College" />
              <StepMarker stepNumber={3} label="Skills" />
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-300"
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        {/* Step body with smooth opacity transition. */}
        <div className="transition-opacity duration-300 ease-in-out">
          {/* Step 1 — Personal Info */}
          {currentStep === 1 && (
            <section className="space-y-5">
              <div>
                <label htmlFor="fullName" className={labelClass}>
                  Full Name
                </label>
                <input
                  id="fullName"
                  className={inputClass}
                  value={formData.fullName}
                  onChange={(e) => setField('fullName', e.target.value)}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={inputClass}
                  value={formData.email}
                  onChange={(e) => setField('email', e.target.value)}
                  placeholder="you@example.com"
                />
                {errors.email && <p className={errorClass}>{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone Number
                </label>
                <input
                  id="phone"
                  className={inputClass}
                  value={formData.phone}
                  onChange={(e) => setField('phone', e.target.value.replace(/[^\d]/g, ''))}
                  placeholder="10-digit phone number"
                  maxLength={10}
                />
                {errors.phone && <p className={errorClass}>{errors.phone}</p>}
              </div>
            </section>
          )}

          {/* Step 2 — College Info */}
          {currentStep === 2 && (
            <section className="space-y-5">
              <div>
                <label htmlFor="collegeName" className={labelClass}>
                  College Name
                </label>
                <input
                  id="collegeName"
                  className={inputClass}
                  value={formData.collegeName}
                  onChange={(e) => setField('collegeName', e.target.value)}
                  placeholder="Enter your college name"
                />
                {errors.collegeName && <p className={errorClass}>{errors.collegeName}</p>}
              </div>

              <div>
                <label htmlFor="yearOfStudy" className={labelClass}>
                  Year of Study
                </label>
                <select
                  id="yearOfStudy"
                  className={inputClass}
                  value={formData.yearOfStudy}
                  onChange={(e) => setField('yearOfStudy', e.target.value)}
                >
                  <option value="">Select year</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
                {errors.yearOfStudy && <p className={errorClass}>{errors.yearOfStudy}</p>}
              </div>

              <div>
                <label htmlFor="branch" className={labelClass}>
                  Branch
                </label>
                <input
                  id="branch"
                  className={inputClass}
                  value={formData.branch}
                  onChange={(e) => setField('branch', e.target.value)}
                  placeholder="Enter your branch"
                />
                {errors.branch && <p className={errorClass}>{errors.branch}</p>}
              </div>
            </section>
          )}

          {/* Step 3 — Skills Profile */}
          {currentStep === 3 && (
            <section className="space-y-6">
              <div>
                <label htmlFor="role" className={labelClass}>
                  Role
                </label>
                <select
                  id="role"
                  className={inputClass}
                  value={formData.role}
                  onChange={(e) => setField('role', e.target.value)}
                >
                  <option value="">Select role</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="ML Engineer">ML Engineer</option>
                  <option value="Designer">Designer</option>
                  <option value="Fullstack">Fullstack</option>
                </select>
                {errors.role && <p className={errorClass}>{errors.role}</p>}
              </div>

              <div>
                <p className={labelClass}>Skills</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {skillOptions.map((skill) => (
                    <label
                      key={skill}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:border-indigo-400"
                    >
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                        className="h-4 w-4 accent-indigo-500"
                      />
                      {skill}
                    </label>
                  ))}
                </div>
                {errors.skills && <p className={errorClass}>{errors.skills}</p>}
              </div>

              <div>
                <p className={labelClass}>Experience</p>
                <div className="flex flex-wrap gap-5">
                  {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <label key={level} className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="radio"
                        name="experience"
                        value={level}
                        checked={formData.experience === level}
                        onChange={(e) => setField('experience', e.target.value)}
                        className="h-4 w-4 accent-indigo-500"
                      />
                      {level}
                    </label>
                  ))}
                </div>
                {errors.experience && <p className={errorClass}>{errors.experience}</p>}
              </div>
            </section>
          )}
        </div>

        {/* Request-level error message block. */}
        {requestError && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {requestError}
          </div>
        )}

        {/* Navigation buttons for step controls and submit. */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-lg bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-lg bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
