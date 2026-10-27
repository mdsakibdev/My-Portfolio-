import { Mail } from "lucide-react";
import { FaGithub as GitHub, FaLinkedin as LinkedIn, FaWhatsapp as WhatsApp } from "react-icons/fa6";
import { ContactDialog } from "@/components/contact/contact-dialog";
import { Reveal } from "@/components/motion/reveal";
import { personalInfo } from "@/lib/data/personal-info";

const channels = [
  {
    label: "Email",
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
    Icon: Mail,
    note: "Best for detailed inquiries",
  },
  {
    label: "WhatsApp",
    value: personalInfo.whatsapp.label,
    href: personalInfo.whatsapp.url,
    Icon: WhatsApp,
    note: "Quick chat & questions",
  },
  {
    label: "GitHub",
    value: "@mdsakibdev",
    href: personalInfo.github.url,
    Icon: GitHub,
    note: "See my code & projects",
  },
  {
    label: "LinkedIn",
    value: "Abdur Razzak Sakib",
    href: personalInfo.linkedin.url,
    Icon: LinkedIn,
    note: "Connect with me",
  },
];

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-24 sm:py-28">
      <div className="container-site">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-hairline bg-surface p-8 sm:p-12 lg:p-16">
            {/* Subtle accent wash */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(38rem 20rem at 85% 0%, rgba(163, 230, 53, 0.08), transparent 65%)",
              }}
            />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                  Contact
                </p>
                <h2
                  id="contact-heading"
                  className="text-section-heading mt-3 font-bold"
                >
                  Let&rsquo;s Build Something{" "}
                  <span className="text-accent">Meaningful.</span>
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-muted sm:text-lg">
                  Have a project idea, collaboration opportunity, or development-related question?
                  Feel free to get in touch.
                </p>

                <ContactDialog />
              </div>

              <ul className="grid gap-4 sm:grid-cols-2 lg:content-start">
                {channels.map(({ label, value, href, Icon, note }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                      className="flex h-full flex-col gap-3 rounded-2xl border border-hairline bg-elevated p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60"
                    >
                      <span
                        aria-hidden="true"
                        className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent"
                      >
                        <Icon className="size-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-foreground">{label}</span>
                        <span className="mt-0.5 block truncate text-sm text-muted">{value}</span>
                      </span>
                      <span className="text-xs text-muted/80">{note}</span>
                      <span className="sr-only">
                        {href.startsWith("mailto:") ? "Opens your email client" : "(opens in a new tab)"}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
