"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import { ContactForm } from "./contact-form";

const focusableSelector =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ContactDialog() {
  const [open, setOpen] = useState(false);
  const [mounted] = useState(() => typeof document !== "undefined");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);

  // Lock scrolling, make the page behind inert, handle Escape/focus trapping,
  // and restore focus + scroll state when the dialog closes.
  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const panel = panelRef.current;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const background = panel
      ? Array.from(document.body.children).filter(
          (element): element is HTMLElement =>
            element instanceof HTMLElement && !element.contains(panel),
        )
      : [];
    const previouslyInert = background.map((element) => element.hasAttribute("inert"));
    background.forEach((element) => element.setAttribute("inert", ""));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (active === panel) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const focusFrame = requestAnimationFrame(() => panel?.focus());

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      background.forEach((element, index) => {
        if (!previouslyInert[index]) element.removeAttribute("inert");
      });
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="group mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-background transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
      >
        Say Hello
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </button>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  key="contact-dialog"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onPointerDown={(event) => {
                    if (event.target === event.currentTarget) close();
                  }}
                  className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm sm:p-6"
                >
                  <motion.div
                    ref={panelRef}
                    id="contact-dialog"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="contact-dialog-title"
                    aria-describedby="contact-dialog-description"
                    tabIndex={-1}
                    variants={{
                      hidden: { opacity: 0, y: 18, scale: 0.97 },
                      visible: { opacity: 1, y: 0, scale: 1 },
                    }}
                    transition={{ duration: 0.26, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-hairline bg-surface shadow-[0_24px_90px_-24px_rgba(0,0,0,0.85)] outline-none"
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(30rem 16rem at 100% 0%, rgba(163, 230, 53, 0.08), transparent 65%)",
                      }}
                    />

                    <header className="relative shrink-0 border-b border-hairline px-6 py-5 pr-16 sm:px-8 sm:pr-20">
                      <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                        Contact
                      </p>
                      <h2
                        id="contact-dialog-title"
                        className="mt-2 text-2xl font-bold sm:text-3xl"
                      >
                        Let&rsquo;s Work Together
                      </h2>
                      <p
                        id="contact-dialog-description"
                        className="mt-2 max-w-md text-sm leading-relaxed text-muted"
                      >
                        Share a few details about your project or inquiry and I&rsquo;ll get
                        back to you.
                      </p>

                      <button
                        type="button"
                        onClick={close}
                        aria-label="Close contact form"
                        className="absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-lg border border-hairline text-muted transition-colors hover:border-accent/60 hover:text-accent"
                      >
                        <X className="size-4.5" aria-hidden="true" />
                      </button>
                    </header>

                    <div className="relative overflow-y-auto overscroll-contain px-6 py-6 sm:px-8 sm:py-7">
                      <ContactForm onClose={close} />
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
