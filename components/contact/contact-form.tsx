"use client";

import { useId, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { ChevronDown, CircleAlert, CircleCheck, Loader2, Send } from "lucide-react";
import {
  EMPTY_CONTACT_FORM,
  INQUIRY_TYPES,
  validateContactForm,
  type ContactApiResponse,
  type ContactField,
  type ContactFieldErrors,
  type ContactFormValues,
} from "@/lib/contact/schema";
import { personalInfo } from "@/lib/data/personal-info";

const FIELD_ORDER: ContactField[] = [
  "fullName",
  "email",
  "phone",
  "inquiryType",
  "subject",
  "message",
];

const inputBase =
  "w-full rounded-xl border bg-elevated px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted/60 disabled:cursor-not-allowed disabled:opacity-60";

function inputTone(hasError: boolean): string {
  return hasError ? "border-red-400/70" : "border-hairline hover:border-muted/40";
}

function isContactApiResponse(value: unknown): value is ContactApiResponse {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return record.ok === true || (record.ok === false && typeof record.error === "string");
}

function readFieldErrors(value: unknown): ContactFieldErrors | null {
  if (typeof value !== "object" || value === null) return null;
  return value as ContactFieldErrors;
}

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}

function Field({ id, label, required, optional, error, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-baseline gap-1.5 text-sm font-medium text-foreground"
      >
        {label}
        {required ? (
          <span className="text-accent" aria-hidden="true">
            *
          </span>
        ) : null}
        {optional ? <span className="text-xs font-normal text-muted">(optional)</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs leading-relaxed text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface ContactFormProps {
  onClose: () => void;
}

export function ContactForm({ onClose }: ContactFormProps) {
  const id = useId();
  const [values, setValues] = useState<ContactFormValues>({ ...EMPTY_CONTACT_FORM });
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const isSubmitting = status === "submitting";

  function updateField(field: ContactField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
    if (formError) setFormError(null);
  }

  function focusField(field: ContactField) {
    requestAnimationFrame(() => {
      document.getElementById(`${id}-${field}`)?.focus();
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validateContactForm(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
      if (firstInvalid) focusField(firstInvalid);
      return;
    }

    setStatus("submitting");
    setFormError(null);
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website }),
      });

      const result: unknown = await response.json().catch(() => null);

      if (!response.ok || !isContactApiResponse(result) || result.ok !== true) {
        const apiError =
          isContactApiResponse(result) && result.ok === false
            ? result.error
            : "Your message could not be sent right now. Please try again.";
        setStatus("error");
        setFormError(apiError);

        if (isContactApiResponse(result) && result.ok === false) {
          const serverFieldErrors = readFieldErrors(result.fieldErrors);
          if (serverFieldErrors) {
            setErrors(serverFieldErrors);
            const firstInvalid = FIELD_ORDER.find((field) => serverFieldErrors[field]);
            if (firstInvalid) focusField(firstInvalid);
          }
        }
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setFormError(
        "Your message could not be sent. Please check your connection and try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center py-6 text-center sm:py-10">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <CircleCheck className="size-7" aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-xl font-bold sm:text-2xl">Message sent</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Thanks for reaching out — your message was sent successfully. I&rsquo;ll reply to
          your email as soon as I can.
        </p>
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${id}-fullName`}
          label="Full Name"
          required
          error={errors.fullName}
        >
          <input
            id={`${id}-fullName`}
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            value={values.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            required
            maxLength={100}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? `${id}-fullName-error` : undefined}
            className={`${inputBase} ${inputTone(Boolean(errors.fullName))}`}
          />
        </Field>

        <Field
          id={`${id}-email`}
          label="Email Address"
          required
          error={errors.email}
        >
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
            maxLength={254}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
            className={`${inputBase} ${inputTone(Boolean(errors.email))}`}
          />
        </Field>

        <Field
          id={`${id}-phone`}
          label="Phone Number"
          optional
          error={errors.phone}
        >
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+880 1XXXXXXXXX"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            maxLength={30}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
            className={`${inputBase} ${inputTone(Boolean(errors.phone))}`}
          />
        </Field>

        <Field
          id={`${id}-inquiryType`}
          label="Inquiry Type"
          required
          error={errors.inquiryType}
        >
          <div className="relative">
            <select
              id={`${id}-inquiryType`}
              name="inquiryType"
              value={values.inquiryType}
              onChange={(event) => updateField("inquiryType", event.target.value)}
              required
              aria-invalid={Boolean(errors.inquiryType)}
              aria-describedby={errors.inquiryType ? `${id}-inquiryType-error` : undefined}
              className={`${inputBase} ${inputTone(Boolean(errors.inquiryType))} appearance-none pr-10 ${
                values.inquiryType ? "" : "text-muted"
              }`}
            >
              <option value="" disabled>
                Select an inquiry type
              </option>
              {INQUIRY_TYPES.map((type) => (
                <option key={type} value={type} className="bg-surface text-foreground">
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
          </div>
        </Field>

        <Field
          id={`${id}-subject`}
          label="Subject"
          optional
          error={errors.subject}
          className="sm:col-span-2"
        >
          <input
            id={`${id}-subject`}
            name="subject"
            type="text"
            autoComplete="off"
            placeholder="What would you like to discuss?"
            value={values.subject}
            onChange={(event) => updateField("subject", event.target.value)}
            maxLength={150}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? `${id}-subject-error` : undefined}
            className={`${inputBase} ${inputTone(Boolean(errors.subject))}`}
          />
        </Field>

        <Field
          id={`${id}-message`}
          label="Message"
          required
          error={errors.message}
          className="sm:col-span-2"
        >
          <textarea
            id={`${id}-message`}
            name="message"
            rows={4}
            placeholder="Tell me about your project, opportunity, or inquiry..."
            value={values.message}
            onChange={(event) => updateField("message", event.target.value)}
            required
            maxLength={5000}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${id}-message-error` : undefined}
            className={`${inputBase} ${inputTone(Boolean(errors.message))} min-h-32 resize-y`}
          />
        </Field>
      </div>

      {/* Honeypot: hidden from visitors and assistive tech; bots tend to fill it. */}
      <div
        className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor={`${id}-website`}>Website</label>
        <input
          id={`${id}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      {formError ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-400/5 p-4 text-sm leading-relaxed text-red-300"
        >
          <CircleAlert className="mt-0.5 size-4.5 shrink-0" aria-hidden="true" />
          <p>
            {formError}{" "}
            <a
              href={`mailto:${personalInfo.email}`}
              className="font-medium text-foreground underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent"
            >
              Email me directly
            </a>
            .
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted">
          Prefer email?{" "}
          <a
            href={`mailto:${personalInfo.email}`}
            className="text-foreground underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent"
          >
            {personalInfo.email}
          </a>
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-background transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Sending...
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden="true" />
              Send Message
            </>
          )}
        </button>
      </div>
    </form>
  );
}
