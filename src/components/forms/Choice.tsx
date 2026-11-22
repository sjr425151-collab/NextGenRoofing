"use client";

import { useId } from "react";

export type ChoiceOption<T extends string> = { value: T; label: string; hint?: string };

/** Accessible radio-card group (native radios; arrow keys work out of the box). */
export function ChoiceGroup<T extends string>({
  legend,
  description,
  name,
  options,
  value,
  onChange,
  columns = 2,
  error,
}: {
  legend: string;
  description?: string;
  name: string;
  options: ChoiceOption<T>[];
  value: T | undefined;
  onChange: (v: T) => void;
  columns?: 2 | 3 | 4;
  error?: string;
}) {
  const id = useId();
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <fieldset className="min-w-0" aria-describedby={[description ? `${id}-d` : "", error ? `${id}-e` : ""].join(" ").trim() || undefined} aria-invalid={error ? true : undefined}>
      <legend className="field-label">{legend}</legend>
      {description ? <p id={`${id}-d`} className="-mt-1 mb-3 text-sm text-steel-2">{description}</p> : null}
      <div className={`grid grid-cols-1 gap-2.5 ${cols}`}>
        {options.map((o) => (
          <label key={o.value} className="option-card">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span className="pr-5 font-semibold leading-snug">{o.label}</span>
            {o.hint ? <span className="text-sm leading-snug text-steel-2">{o.hint}</span> : null}
          </label>
        ))}
      </div>
      {error ? <p id={`${id}-e`} className="field-error" role="alert">{error}</p> : null}
    </fieldset>
  );
}

export function TextField({
  label,
  error,
  hint,
  optional,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string; optional?: boolean }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label} {optional ? <span className="font-normal text-steel-2">(optional)</span> : null}
      </label>
      <input
        id={id}
        className="field-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={[hint ? `${id}-h` : "", error ? `${id}-e` : ""].join(" ").trim() || undefined}
        {...props}
      />
      {hint ? <p id={`${id}-h`} className="mt-1.5 text-sm text-steel-2">{hint}</p> : null}
      {error ? <p id={`${id}-e`} className="field-error">{error}</p> : null}
    </div>
  );
}

export function TextArea({ label, error, optional, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; optional?: boolean }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label} {optional ? <span className="font-normal text-steel-2">(optional)</span> : null}
      </label>
      <textarea id={id} className="field-input min-h-28 resize-y" aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-e` : undefined} {...props} />
      {error ? <p id={`${id}-e`} className="field-error">{error}</p> : null}
    </div>
  );
}
