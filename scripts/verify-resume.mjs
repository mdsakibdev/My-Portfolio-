/**
 * Inspects public/resume.pdf without a viewer:
 *   - page count and page size
 *   - selectable text extraction (ATS check) with spot content assertions
 *   - clickable link annotations (mailto:, live URLs, repo URLs)
 *
 *   node scripts/verify-resume.mjs
 * Requires: npm i --no-save pdfjs-dist
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const pdfPath = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..", "public", "resume.pdf");
const data = new Uint8Array(fs.readFileSync(pdfPath));

const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
// The legacy build runs without a worker in Node when none is configured.

const doc = await getDocument({ data, useSystemFonts: true }).promise;
const results = [];
const check = (name, pass, detail = "") =>
  results.push(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);

check("PDF exists and parses", true, `${pdfPath} (${doc.numPages} page(s))`);
check("fits on one page", doc.numPages === 1, `${doc.numPages} page(s)`);

const page1 = await doc.getPage(1);
const { width, height } = page1.getViewport({ scale: 1 });
check("letter page size", Math.abs(width - 612) < 2 && Math.abs(height - 792) < 2, `${width}x${height}pt`);

const text = (await page1.getTextContent()).items.map((i) => i.str).join(" ");
const mustContain = [
  "ABDUR RAZZAK SAKIB",
  "Full-Stack Web Developer",
  "abdurrazzaqsakib@gmail.com",
  "01876271346",
  "PROFESSIONAL SUMMARY",
  "TECHNICAL SKILLS",
  "SELECTED PROJECTS",
  "EDUCATION",
  "Bangla News 24",
  "Bazar Dor",
  "Verdant Table",
  "Qawmi Madrasa",
  "Tailwind CSS",
  "PostgreSQL",
  "Express.js",
];
for (const s of mustContain) {
  check(`contains "${s}"`, text.includes(s));
}
const forbidden = ["2022", "2023", "2024", "2025", "Senior", "expert", "years of experience", "Cloudflare"];
for (const s of forbidden) {
  check(`does not contain "${s}"`, !text.includes(s));
}

const annotations = (await page1.getAnnotations({ intent: "display" })) ?? [];
const uris = annotations.filter((a) => a.subtype === "Link").map((a) => a.url ?? a.unsafeUrl);
const expectedUris = [
  "mailto:abdurrazzaqsakib@gmail.com",
  "https://wa.me/8801876271346",
  "https://github.com/mdsakibdev",
  "https://www.linkedin.com/in/abdurrazzak1",
  "https://bangla-news24-two.vercel.app/",
  "https://github.com/mdsakibdev/Bangla-News-24",
  "https://bazar-dor-sable.vercel.app/",
  "https://github.com/mdsakibdev/Bazar-Dor",
  "https://verdant-table-puce.vercel.app/",
  "https://github.com/mdsakibdev/Verdant-Table",
];
for (const u of expectedUris) {
  check(`link annotation for ${u}`, uris.includes(u));
}
check("no unexpected link destinations", uris.every((u) => expectedUris.includes(u)), uris.join(" "));

console.log(results.join("\n"));
if (results.some((r) => r.startsWith("FAIL"))) process.exitCode = 1;
