"use client";

import { useId } from "react";
import { FieldMessage } from "./FieldMessage";

type TextFieldProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  helperText?: string;
  errorText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  onChange?: (next: string) => void;
  id?: string;
  name?: string;
  type?: string;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  className?: string;
};

/**
 * Text input field — the single source of input chrome across the app.
 *
 * States:
 * - default — `--color-border` on `--color-surface-elevated`.
 * - focused — wrapper border transitions to `--color-action-primary` via
 *   `:focus-within`. The native input has `focus:outline-none` so the
 *   border change is the only visual cue.
 * - filled — same chrome as default; the input value carries the state.
 * - error — `--color-danger` border + `FieldMessage` with `tone="error"`
 *   beneath. Native `aria-invalid="true"` set on the input, plus
 *   `aria-describedby` pointing at the message.
 * - disabled — `opacity-[var(--opacity-disabled)] pointer-events-none`
 *   on the wrapper, native `disabled` on the input.
 *
 * The label is bound to the input via `htmlFor` / `id`. When no id is
 * provided, one is generated with `useId()`.
 *
 * Use for: email, password, name, search-by-flight-number, free-text
 * fields. For "search-the-app" use `<SearchField>` which has different
 * chrome and clear behaviour.
 */
export function TextField({
  label,
  placeholder,
  value,
  defaultValue,
  helperText,
  errorText,
  leadingIcon,
  trailingIcon,
  disabled = false,
  required = false,
  onChange,
  id,
  name,
  type = "text",
  inputMode,
  autoComplete,
  className = "",
}: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const messageId = `${fieldId}-message`;
  const hasError = errorText != null && errorText.length > 0;
  const message = hasError ? errorText : helperText;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`.trim()}>
      {label ? (
        <label
          htmlFor={fieldId}
          className="text-label text-[var(--color-text-primary)]"
        >
          {label}
          {required ? (
            <span aria-hidden className="text-[var(--color-danger)]">
              {" *"}
            </span>
          ) : null}
        </label>
      ) : null}

      <div
        className={`flex h-[52px] w-full items-center gap-3 rounded-[var(--radius-panel)] border bg-[var(--color-surface-elevated)] px-4 transition-colors duration-150 ${
          hasError
            ? "border-[var(--color-danger)]"
            : "border-[var(--color-border)] focus-within:border-[var(--color-action-primary)]"
        } ${disabled ? "opacity-[var(--opacity-disabled)] pointer-events-none" : ""}`.trim()}
      >
        {leadingIcon ? (
          <span
            aria-hidden
            className="inline-flex shrink-0 items-center text-[var(--color-text-secondary)]"
          >
            {leadingIcon}
          </span>
        ) : null}
        <input
          id={fieldId}
          name={name}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={message ? messageId : undefined}
          aria-required={required || undefined}
          onChange={(event) => onChange?.(event.target.value)}
          className="flex-1 bg-transparent text-body text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
        />
        {trailingIcon ? (
          <span
            aria-hidden
            className="inline-flex shrink-0 items-center text-[var(--color-text-secondary)]"
          >
            {trailingIcon}
          </span>
        ) : null}
      </div>

      {message ? (
        <FieldMessage id={messageId} tone={hasError ? "error" : "neutral"}>
          {message}
        </FieldMessage>
      ) : null}
    </div>
  );
}
