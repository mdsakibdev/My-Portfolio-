"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Projects", href: "#projects" },
] as const;

/**
 * Section links: a plain semantic <a> for same-page hashes so the browser
 * performs its native (smooth, scroll-padding-aware) fragment scroll. A
 * hash-only <Link href="#contact"> updates the URL but never scrolls in the
 * App Router, so <Link> is only used when the target includes a pathname
 * (e.g. "/#contact" from a project details page).
 */
function SectionLink({
  href,
  children,
  onClick,
  ...rest
}: { href: string; children: ReactNode; onClick?: () => void } & Omit<
  ComponentPropsWithoutRef<"a">,
  "href" | "children" | "onClick"
>) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("#home");
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const isHomePage = pathname === "/";
  const href = (hash: string) => (isHomePage ? hash : `/${hash}`);

  /** Close the mobile menu. Menu links keep the native anchor behavior; the
   *  scroll-lock that used to fight the fragment scroll no longer exists. */
  const closeMobileMenu = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the section currently in view (homepage only).
  useEffect(() => {
    if (!isHomePage) return;
    const sections = navLinks
      .map(({ href: hash }) => document.querySelector<HTMLElement>(hash))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHash(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHomePage]);

  // The mobile menu closes via link onClick handlers; Escape is handled below.

  // The mobile menu panel lives inside the fixed <header>, so it stays put
  // even if the page scrolls behind it — no body scroll lock is needed (and
  // toggling body overflow breaks the browser's native fragment scroll in
  // Chromium, which is exactly what broke menu navigation before).

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-hairline bg-background/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="container-site flex h-16 items-center justify-between sm:h-18"
      >
        <SectionLink
          href={href("#home")}
          className="font-display text-lg font-extrabold tracking-tight"
          aria-label="SAKIB.DEV — back to home"
        >
          SAKIB<span className="text-accent">.DEV</span>
        </SectionLink>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ label, href: hash }) => {
            const isActive = isHomePage && activeHash === hash;
            return (
              <li key={hash}>
                <SectionLink
                  href={href(hash)}
                  aria-current={isActive ? "true" : undefined}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-foreground underline decoration-accent decoration-2 underline-offset-8"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {label}
                </SectionLink>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <SectionLink
            href={href("#contact")}
            className="hidden items-center gap-1.5 rounded-full bg-accent px-4.5 py-2.5 text-sm font-semibold text-background transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] md:inline-flex"
          >
            Contact
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </SectionLink>

          {/* Mobile menu button */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex size-10 items-center justify-center rounded-lg border border-hairline text-foreground transition-colors hover:border-accent/60 hover:text-accent md:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu — plain conditional panel (no exit animation): animating
          the unmount with AnimatePresence hooked the menu-close state update
          into the link click's critical path, which canceled the browser's
          native fragment scroll. A CSS-transition panel avoids that. */}
      {open ? (
        <div
          id="mobile-menu"
          className="mobile-menu-panel overflow-hidden border-t border-hairline bg-background/95 backdrop-blur-md md:hidden"
        >
          <ul className="container-site flex flex-col gap-1 py-4">
              {navLinks.map(({ label, href: hash }) => (
                <li key={hash}>
                  <SectionLink
                    href={href(hash)}
                    onClick={closeMobileMenu}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
                  >
                    {label}
                  </SectionLink>
                </li>
              ))}
              <li>
                <SectionLink
                  href={href("#contact")}
                  onClick={closeMobileMenu}
                  className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-3 text-base font-semibold text-background"
                >
                  Contact
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </SectionLink>
              </li>
            </ul>
          </div>
        ) : null}
      </header>
  );
}
