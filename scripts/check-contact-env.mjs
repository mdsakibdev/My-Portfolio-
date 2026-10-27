#!/usr/bin/env node
/**
 * Reports whether the contact form can reach Resend, without printing secrets.
 * Usage: npm run check:contact
 */
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const required = ["CONTACT_EMAIL", "RESEND_API_KEY"];
const optional = ["RESEND_FROM_EMAIL"];

function describe(name, isRequired) {
  const value = (process.env[name] ?? "").trim();
  if (!value) {
    return isRequired
      ? "MISSING (required)"
      : "not set (will use onboarding@resend.dev — test-only)";
  }
  return `set (${value.length} characters)`;
}

console.log("Contact form environment:");
for (const name of required) {
  console.log(`  ${name.padEnd(18)} ${describe(name, true)}`);
}
for (const name of optional) {
  console.log(`  ${name.padEnd(18)} ${describe(name, false)}`);
}

const missing = required.filter((name) => !(process.env[name] ?? "").trim());
if (missing.length > 0) {
  console.error(
    `\nNot ready: missing ${missing.join(", ")}. Add them to .env.local (see .env.example).`,
  );
  process.exitCode = 1;
} else {
  console.log(
    "\nRequired variables are present. Restart the dev server if it was already running when you added them.",
  );
}
