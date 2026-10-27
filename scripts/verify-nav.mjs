/**
 * One-off browser verification for the contact-navigation fixes and the resume.
 * Run while `npm run dev` is serving http://localhost:3000:
 *
 *   node scripts/verify-nav.mjs
 *
 * Requires playwright + chromium (see scripts/generate-resume.mjs header).
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const results = [];
const check = (name, pass, detail = "") =>
  results.push(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);

const browser = await chromium.launch();
try {
  // Each block is isolated so one exception still yields the full report.
  const block = (label, fn) =>
    fn().catch((e) => results.push(`FAIL  [${label}] test crashed — ${String(e).split("\n")[0]}`));
  // ---------- Homepage: hero "Email me" ----------
  await block("homepage", async () => {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(BASE, { waitUntil: "networkidle" });

    const heroEmail = page.getByRole("link", { name: "Go to the Contact section" });
    check("hero 'Email me' href is #contact", (await heroEmail.getAttribute("href")) === "#contact");

    const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const scrollToTarget = async () => {
      // Wait for the smooth scroll to settle.
      let last = -1;
      for (let i = 0; i < 30; i++) {
        const y = await page.evaluate(() => window.scrollY);
        if (Math.abs(y - last) < 1) return y;
        last = y;
        await page.waitForTimeout(150);
      }
      return last;
    };
    await page.evaluate(() => window.scrollTo(0, 0));
    await heroEmail.click();
    const scrollY = await scrollToTarget();
    const { contactTop, viewportH, navbarH, scrollPadding } = await page.evaluate(() => {
      const contact = document.getElementById("contact");
      const header = document.querySelector("header");
      return {
        contactTop: contact ? contact.getBoundingClientRect().top + window.scrollY : null,
        viewportH: window.innerHeight,
        navbarH: header ? header.getBoundingClientRect().height : 0,
        scrollPadding: parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop || "0"),
      };
    });
    const contactVisible = contactTop !== null && contactTop - scrollY >= navbarH - 2;
    check(
      "hero 'Email me' scrolls to the contact section (stops at scroll-padding offset)",
      contactTop !== null && Math.abs(scrollY - (contactTop - scrollPadding)) < 5,
      `scrollY=${scrollY.toFixed(0)}, expected≈${(contactTop - scrollPadding).toFixed(0)}, docHeight=${docHeight}`
    );
    check(
      "contact section not hidden behind fixed navbar",
      contactVisible,
      `navbar=${navbarH.toFixed(0)}px, heading gap=${(contactTop - scrollY - navbarH).toFixed(0)}px`
    );

    // Duplicate-ID sanity across all anchors on the page.
    const dupIds = await page.evaluate(() => {
      const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
      return ids.filter((id, i) => ids.indexOf(id) !== i);
    });
    check("no duplicate element IDs on homepage", dupIds.length === 0, dupIds.join(", ") || "none");

    // Every internal hash link targets an existing id.
    const brokenHashes = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="#"]')]
        .map((a) => a.getAttribute("href"))
        .filter((h) => h.length > 1 && !document.getElementById(h.slice(1)))
    );
    check("all same-page hash links target existing ids", brokenHashes.length === 0, brokenHashes.join(" ") || "none");

    // ---------- Navbar Contact (desktop) ----------
    const navbarContact = page.locator("header nav a, header nav > * a").filter({ hasText: "Contact" }).first();
    const navContactHref = await navbarContact.getAttribute("href");
    const navContactTag = await navbarContact.evaluate((el) => el.tagName.toLowerCase());
    check("navbar Contact href correct", navContactHref === "#contact", `href=${navContactHref} tag=${navContactTag}`);

    await page.evaluate(() => window.scrollTo(0, 0));
    await navbarContact.click();
    const navY = await (async () => {
      let last = -1;
      for (let i = 0; i < 30; i++) {
        const y = await page.evaluate(() => window.scrollY);
        if (Math.abs(y - last) < 1) return y;
        last = y;
        await page.waitForTimeout(150);
      }
      return last;
    })();
    const navTop = await page.evaluate(
      () => document.getElementById("contact").getBoundingClientRect().top + window.scrollY
    );
    const navPadding = await page.evaluate(
      () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop || "0")
    );
    check(
      "navbar Contact click scrolls to contact section",
      Math.abs(navY - (navTop - navPadding)) < 5,
      `scrollY=${navY.toFixed(0)}, expected≈${(navTop - navPadding).toFixed(0)}`
    );

    // ---------- Contact section email links ----------
    const mailtoLinks = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="mailto:"]')].map((a) => a.getAttribute("href"))
    );
    check(
      "all mailto links use the correct address",
      mailtoLinks.length > 0 && mailtoLinks.every((h) => h === "mailto:abdurrazzaqsakib@gmail.com"),
      mailtoLinks.join(" ")
    );

    // ---------- Download Resume ----------
    const resumeLink = page.getByRole("link", { name: /download resume/i });
    const resumeHref = await resumeLink.getAttribute("href");
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 15000 }),
      resumeLink.click(),
    ]);
    check(
      "Download Resume triggers the PDF download",
      resumeHref === "/resume.pdf" && download.suggestedFilename() === "resume.pdf",
      `href=${resumeHref}, filename=${download.suggestedFilename()}`
    );
    await page.close();
  });

  // ---------- Project detail page: navbar Contact cross-route ----------
  await block("detail-page", async () => {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(`${BASE}/projects/bangla-news-24`, { waitUntil: "networkidle" });
    const navbarContact = page.locator("header a").filter({ hasText: "Contact" }).first();
    const href = await navbarContact.getAttribute("href");
    check("detail-page navbar Contact points to /#contact", href === "/#contact", `href=${href}`);

    await navbarContact.click();
    await page.waitForURL(/localhost:3000\/#contact/, { timeout: 10000 });
    let dLast = -1;
    for (let i = 0; i < 30; i++) {
      const y = await page.evaluate(() => window.scrollY);
      if (Math.abs(y - dLast) < 1) break;
      dLast = y;
      await page.waitForTimeout(150);
    }
    const { path: p, y, top } = await page.evaluate(() => ({
      path: window.location.pathname,
      y: window.scrollY,
      top: document.getElementById("contact").getBoundingClientRect().top + window.scrollY,
    }));
    const padding = await page.evaluate(
      () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop || "0")
    );
    check(
      "detail-page navbar Contact navigates home and scrolls to contact",
      p === "/" && Math.abs(y - (top - padding)) < 5,
      `path=${p}, scrollY=${y.toFixed(0)}, expected≈${(top - padding).toFixed(0)}`
    );
    await page.close();
  });

  // ---------- Mobile menu ----------
  await block("mobile", async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(BASE, { waitUntil: "networkidle" });
    const menuButton = page.getByRole("button", { name: "Open navigation menu" });
    const allTargets = [
      ["Home", "#home"],
      ["About", "#about"],
      ["Skills", "#skills"],
      ["Education", "#education"],
      ["Projects", "#projects"],
      ["Contact", "#contact"],
    ];
    for (const [label, hash] of allTargets) {
      await menuButton.click();
      await page.waitForTimeout(350);
      await page.locator(`#mobile-menu a[href="#${hash.slice(1)}"]`).first().click();
      await page.waitForTimeout(350); // let the menu-close re-render finish
      // wait for smooth scroll to settle
      let last = -1;
      for (let i = 0; i < 30; i++) {
        const y = await page.evaluate(() => window.scrollY);
        if (Math.abs(y - last) < 1) break;
        last = y;
        await page.waitForTimeout(150);
      }
      const { y, top, padding, menuStillOpen } = await page.evaluate((h) => ({
        y: window.scrollY,
        top: document.getElementById(h.slice(1)).getBoundingClientRect().top + window.scrollY,
        padding: parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop || "0"),
        menuStillOpen: document.getElementById("mobile-menu") !== null,
      }), hash);
      const expected = Math.max(0, top - padding); // can't scroll above the top
      check(
        `mobile menu "${label}" scrolls to ${hash}`,
        Math.abs(y - expected) < 5 && !menuStillOpen,
        `scrollY=${y.toFixed(0)}, expected≈${expected.toFixed(0)}, menuOpen=${menuStillOpen}`
      );
    }
    await page.close();
  });
} finally {
  await browser.close();
}

const failed = results.filter((r) => r.startsWith("FAIL"));
console.log(results.join("\n"));
if (failed.length > 0) process.exitCode = 1;
