import { ArrowUp, Mail } from "lucide-react";
import { FaGithub as GitHub, FaLinkedin as LinkedIn } from "react-icons/fa6";
import { personalInfo } from "@/lib/data/personal-info";
import CopyrightYear from "@/components/copyright-year";

export function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="container-site flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-lg font-extrabold tracking-tight">
            SAKIB<span className="text-accent">.DEV</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Building digital experiences that make an impact.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${personalInfo.email}`}
            aria-label="Email Abdur Razzak Sakib"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-hairline text-muted transition-colors hover:border-accent/60 hover:text-accent"
          >
            <Mail className="size-4.5" aria-hidden="true" />
          </a>
          <a
            href={personalInfo.github.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abdur Razzak Sakib on GitHub"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-hairline text-muted transition-colors hover:border-accent/60 hover:text-accent"
          >
            <GitHub className="size-4.5" aria-hidden="true" />
          </a>
          <a
            href={personalInfo.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abdur Razzak Sakib on LinkedIn"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-hairline text-muted transition-colors hover:border-accent/60 hover:text-accent"
          >
            <LinkedIn className="size-4.5" aria-hidden="true" />
          </a>
          <span className="sr-only">Follow on social media</span>
          <a
            href="#home"
            aria-label="Back to top of page"
            className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-hairline px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-accent/60 hover:text-accent"
          >
            Back to top
            <ArrowUp className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="container-site flex flex-col gap-1 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
          © <CopyrightYear /> {personalInfo.name}. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-accent" aria-hidden="true" />
            Full-Stack Web Developer
          </p>
        </div>
      </div>
    </footer>
  );
}
