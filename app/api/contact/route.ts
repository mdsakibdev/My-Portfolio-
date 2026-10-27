import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  validateContactForm,
  type ContactFieldErrors,
  type ContactFormValues,
} from "@/lib/contact/schema";

/** Best-effort, per-instance rate limiting. Good enough for a portfolio. */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const submissionsByIp = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissionsByIp.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX) {
    submissionsByIp.set(ip, recent);
    return true;
  }

  recent.push(now);
  submissionsByIp.set(ip, recent);

  // Keep the map from growing without bound on a long-lived server.
  if (submissionsByIp.size > 1000) {
    for (const [key, timestamps] of submissionsByIp) {
      if (!timestamps.some((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)) {
        submissionsByIp.delete(key);
      }
    }
  }

  return false;
}

function readField(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function errorResponse(
  error: string,
  status: number,
  fieldErrors?: ContactFieldErrors,
): NextResponse {
  return NextResponse.json(
    fieldErrors ? { ok: false, error, fieldErrors } : { ok: false, error },
    { status },
  );
}

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => HTML_ENTITIES[character] ?? character);
}

function buildTextEmail(values: ContactFormValues): string {
  const lines = [
    "New contact form submission",
    "",
    `Name: ${values.fullName}`,
    `Email: ${values.email}`,
    values.phone ? `Phone: ${values.phone}` : null,
    `Inquiry type: ${values.inquiryType}`,
    values.subject ? `Subject: ${values.subject}` : null,
    "",
    "Message:",
    values.message,
    "",
    `Reply directly to this email to respond to ${values.fullName}.`,
  ];

  return lines.filter((line): line is string => line !== null).join("\n");
}

function buildHtmlEmail(values: ContactFormValues): string {
  const rows: Array<[string, string]> = [
    ["Name", values.fullName],
    ["Email", values.email],
  ];
  if (values.phone) rows.push(["Phone", values.phone]);
  rows.push(["Inquiry type", values.inquiryType]);
  if (values.subject) rows.push(["Subject", values.subject]);

  const rowsHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 20px 8px 0;color:#a1a1aa;font-size:13px;line-height:1.5;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
          <td style="padding:8px 0;color:#fafafa;font-size:14px;line-height:1.5;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background-color:#09090b;font-family:Inter,Arial,Helvetica,sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:32px;border:1px solid #27272a;border-radius:20px;background-color:#18181b;">
      <p style="margin:0 0 6px;color:#a3e635;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
        Portfolio contact
      </p>
      <h1 style="margin:0 0 24px;color:#fafafa;font-size:22px;line-height:1.3;">
        New message from ${escapeHtml(values.fullName)}
      </h1>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border-top:1px solid #27272a;border-bottom:1px solid #27272a;padding:8px 0;">
        <tbody>${rowsHtml}
        </tbody>
      </table>
      <div style="margin-top:24px;padding:20px;border-radius:14px;background-color:#202024;">
        <p style="margin:0 0 10px;color:#a1a1aa;font-size:13px;font-weight:600;">Message</p>
        <p style="margin:0;color:#fafafa;font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(values.message)}</p>
      </div>
      <p style="margin:24px 0 0;color:#a1a1aa;font-size:12px;line-height:1.6;">
        Reply directly to this email to respond to ${escapeHtml(values.fullName)} at ${escapeHtml(values.email)}.
      </p>
    </div>
  </body>
</html>`;
}

export async function POST(request: Request): Promise<NextResponse> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 32_000) {
    return errorResponse("That message is too large to send.", 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request body.", 400);
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return errorResponse("Invalid request body.", 400);
  }

  const payload = body as Record<string, unknown>;

  // Honeypot: real visitors never see or fill this field.
  if (readField(payload.website).trim()) {
    return errorResponse("Invalid submission.", 400);
  }

  const values: ContactFormValues = {
    fullName: readField(payload.fullName).trim(),
    email: readField(payload.email).trim(),
    phone: readField(payload.phone).trim(),
    inquiryType: readField(payload.inquiryType).trim(),
    subject: readField(payload.subject).trim(),
    message: readField(payload.message).trim(),
  };

  const fieldErrors = validateContactForm(values);
  if (Object.keys(fieldErrors).length > 0) {
    return errorResponse(
      "Please check the highlighted fields and try again.",
      400,
      fieldErrors,
    );
  }

  if (isRateLimited(getClientIp(request))) {
    return errorResponse(
      "Too many messages were sent from this connection. Please try again in a few minutes.",
      429,
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_EMAIL;

  if (!apiKey || !recipient) {
    console.error(
      "Contact form is not configured. Set CONTACT_EMAIL, RESEND_API_KEY, and RESEND_FROM_EMAIL.",
    );
    return errorResponse(
      "The contact form is temporarily unavailable. Please email me directly instead.",
      503,
    );
  }

  const from =
    process.env.RESEND_FROM_EMAIL ?? "Portfolio Contact <onboarding@resend.dev>";
  const safeSubject = values.subject.replace(/[\r\n]+/g, " ");
  const subject = `[Portfolio] ${values.inquiryType}${
    safeSubject ? ` — ${safeSubject}` : ""
  }`.slice(0, 200);

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from,
      to: recipient,
      replyTo: values.email,
      subject,
      text: buildTextEmail(values),
      html: buildHtmlEmail(values),
    });

    if (error) {
      console.error("Resend rejected the contact email:", error.name, error.message);
      return errorResponse(
        "Your message could not be sent right now. Please try again or email me directly.",
        502,
      );
    }
  } catch (error) {
    console.error(
      "Resend request failed:",
      error instanceof Error ? error.name : "Unknown error",
    );
    return errorResponse(
      "Your message could not be sent right now. Please try again or email me directly.",
      502,
    );
  }

  return NextResponse.json({ ok: true });
}
