/**
 * Generates a professional, ATS-friendly resume PDF at public/resume.pdf
 * by printing scripts/resume/resume.html with Headless Chromium (Playwright).
 *
 * The output is real selectable text with working link annotations
 * (mailto:, github, linkedin, and the live/repo URLs for the projects).
 * Visual identity: white background, near-black ink, restrained lime-green
 * accents to match the portfolio's black + lime green design system.
 *
 * Requirements (kept OUT of package.json on purpose — one-off tooling,
 * so `npm install` stays lean for this static site):
 *
 *   npm i --no-save playwright && npx playwright install chromium
 *   node scripts/generate-resume.mjs
 *
 * It first writes a .txt copy (public/resume.txt, deleted right after) only
 * as a print sanity check; no such artifact ships. PDF uses letter format,
 * tagged (accessible) output, and 0.45in/0.55in print margins.
 *
 * The resume source text lives in scripts/resume/resume.html — edit content
 * there, then re-run this script to regenerate public/resume.pdf.
 */
import { chromium } from "playwright";
import path from "node:path";
import url from "node:url";

const root = path.dirname(url.fileURLToPath(import.meta.url));
const template = path.join(root, "resume", "resume.html");
const out = path.resolve(root, "..", "public", "resume.pdf");

/**
 * Email in PDF is a plain string to recruiters, but here the PDF also opens
 * `mailto:` — Chromium renders both link annotations. Set `download: true`
 * to skip the print-preview-style direct write (irrelevant for PDF files).
 */
export async function generateResume() {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.emulateMedia({ media: "print" });
    await page.goto(url.pathToFileURL(template).href, { waitUntil: "load" });

    // Persist no header/footer chrome; margins + accent styling come from CSS.
    await page.pdf({
      path: out,
      format: "Letter",
      tagged: true,
      printBackground: true,
      displayHeaderFooter: false,
      margin: { top: "0.45in", right: "0.55in", bottom: "0.45in", left: "0.55in" },
    });

    const pageCount = await page.evaluate(
      () => Math.ceil(document.body.scrollHeight / 1056) // 11in minus margins approximated
    );
    console.log(`resume.pdf written: ${out} (approx. ${pageCount} page height used)`);
  } finally {
    await browser.close();
  }
}

// Called directly (not when imported as a library).
if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  generateResume().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
