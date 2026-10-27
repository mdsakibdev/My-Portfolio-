/**
 * Server-only contact-form configuration.
 *
 * Import this module from the API route only — never from a client component.
 * Values are read at request time so environment changes do not require a
 * rebuild (the dev server still needs a restart to pick up a new .env file).
 */

const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;
const DEFAULT_FROM = "Portfolio Contact <onboarding@resend.dev>";

export interface ContactEmailConfig {
  apiKey: string;
  recipient: string;
  from: string;
}

export interface ContactConfigResult {
  config: ContactEmailConfig | null;
  missing: string[];
  invalid: string[];
}

function extractEmail(value: string): string {
  const match = value.match(/<([^<>]+)>\s*$/);
  return (match ? match[1] : value).trim();
}

export function readContactConfig(
  env: NodeJS.ProcessEnv = process.env,
): ContactConfigResult {
  const recipient = (env.CONTACT_EMAIL ?? "").trim();
  const apiKey = (env.RESEND_API_KEY ?? "").trim();
  const fromValue = (env.RESEND_FROM_EMAIL ?? "").trim();
  const from = fromValue || DEFAULT_FROM;

  const missing: string[] = [];
  const invalid: string[] = [];

  if (!recipient) {
    missing.push("CONTACT_EMAIL");
  } else if (!EMAIL_PATTERN.test(recipient)) {
    invalid.push("CONTACT_EMAIL");
  }

  if (!apiKey) {
    missing.push("RESEND_API_KEY");
  } else if (/\s/.test(apiKey)) {
    invalid.push("RESEND_API_KEY");
  }

  if (fromValue && !EMAIL_PATTERN.test(extractEmail(fromValue))) {
    invalid.push("RESEND_FROM_EMAIL");
  }

  const config =
    missing.length === 0 && invalid.length === 0
      ? { apiKey, recipient, from }
      : null;

  return { config, missing, invalid };
}
