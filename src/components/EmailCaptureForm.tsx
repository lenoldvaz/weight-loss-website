"use client";

interface EmailCaptureFormProps {
  id?: string;
  buttonLabel?: string;
}

export default function EmailCaptureForm({
  id,
  buttonLabel = "Get Early Access",
}: EmailCaptureFormProps) {
  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: wire up to email capture backend
      }}
      aria-label="Early access sign-up"
    >
      <label htmlFor={id ?? "email-input"} className="sr-only">
        Email address
      </label>
      <input
        id={id ?? "email-input"}
        type="email"
        placeholder="your@email.ca"
        required
        className="h-12 flex-1 rounded-full border border-[var(--color-forest-200)] bg-white px-5 text-sm text-[var(--color-bark)] placeholder-[var(--color-bark-muted)] shadow-sm outline-none ring-[var(--color-forest-300)] focus:border-[var(--color-forest-500)] focus:ring-2 transition"
        autoComplete="email"
      />
      <button
        type="submit"
        className="h-12 rounded-full bg-[var(--color-forest-600)] px-7 text-sm font-semibold text-white shadow-md hover:bg-[var(--color-forest-700)] hover:shadow-lg active:scale-95 transition-all duration-150"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
