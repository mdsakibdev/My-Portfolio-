export const INQUIRY_TYPES = [
  "Job Opportunity",
  "Freelance Project",
  "Website Development",
  "Collaboration",
  "General Inquiry",
  "Other",
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export interface ContactFormValues {
  fullName: string;
  email: string;
  phone: string;
  inquiryType: string;
  subject: string;
  message: string;
}

export type ContactField = keyof ContactFormValues;

export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export const EMPTY_CONTACT_FORM: ContactFormValues = {
  fullName: "",
  email: "",
  phone: "",
  inquiryType: "",
  subject: "",
  message: "",
};

export interface ContactApiSuccess {
  ok: true;
}

export interface ContactApiError {
  ok: false;
  error: string;
  fieldErrors?: ContactFieldErrors;
}

export type ContactApiResponse = ContactApiSuccess | ContactApiError;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+()\d\s.-]+$/;

/**
 * Shared by the client form (instant feedback) and the API route (source of
 * truth). Keep this module free of server-only imports so both can use it.
 */
export function validateContactForm(values: ContactFormValues): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  const fullName = values.fullName.trim();
  if (!fullName) {
    errors.fullName = "Please enter your full name.";
  } else if (fullName.length < 2) {
    errors.fullName = "Your name must be at least 2 characters.";
  } else if (fullName.length > 100) {
    errors.fullName = "Your name must be 100 characters or fewer.";
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  const phone = values.phone.trim();
  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (
      phone.length > 30 ||
      !PHONE_PATTERN.test(phone) ||
      digits.length < 7 ||
      digits.length > 20
    ) {
      errors.phone = "Please enter a valid phone number, or leave it empty.";
    }
  }

  if (!values.inquiryType) {
    errors.inquiryType = "Please choose an inquiry type.";
  } else if (!INQUIRY_TYPES.includes(values.inquiryType as InquiryType)) {
    errors.inquiryType = "Please choose a valid inquiry type.";
  }

  const subject = values.subject.trim();
  if (subject.length > 150) {
    errors.subject = "The subject must be 150 characters or fewer.";
  }

  const message = values.message.trim();
  if (!message) {
    errors.message = "Please tell me a little about your inquiry.";
  } else if (message.length < 10) {
    errors.message = "Please add a little more detail (at least 10 characters).";
  } else if (message.length > 5000) {
    errors.message = "Your message must be 5,000 characters or fewer.";
  }

  return errors;
}
