import Image from "next/image";
import { ArrowDown, Download, Mail } from "lucide-react";
import { FaGithub as GitHub, FaLinkedin as LinkedIn } from "react-icons/fa6";
import { Reveal } from "@/components/motion/reveal";
import { personalInfo } from "@/lib/data/personal-info";

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-heading" className="relative overflow-hidden">
      {/* Soft radial lime tint, kept very subtle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60rem 32rem at 78% -10%, rgba(163, 230, 53, 0.07), transparent 60%)",
        }}
      />

      <div className="container-site grid items-center gap-14 pt-32 pb-20 sm:pt-40 sm:pb-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* Copy */}
        <div>
          <Reveal y={16}>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-surface px-4 py-2 text-[0.7rem] font-semibold tracking-[0.22em] text-muted uppercase">
              <span className="relative inline-flex size-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 [animation-duration:2.6s]" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              {personalInfo.title}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 id="hero-heading" className="text-hero mt-6 font-bold">
              Building <span className="text-accent">Digital Experiences</span> That Make an{" "}
              <span className="text-accent">Impact.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              I&rsquo;m <span className="font-medium text-foreground">Abdur Razzak Sakib</span>, a
              Full-Stack Web Developer focused on building modern, responsive, and user-friendly
              web applications.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-background transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
              >
                Explore My Projects
                <ArrowDown className="size-4" aria-hidden="true" />
              </a>
              <a
                href={personalInfo.resume.path}
                download
                className="inline-flex items-center gap-2 rounded-full border border-hairline px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/60 hover:text-accent"
              >
                Download Resume
                <Download className="size-4" aria-hidden="true" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-10 flex items-center gap-3">
              <a
                href={personalInfo.github.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abdur Razzak Sakib on GitHub"
                className="inline-flex size-11 items-center justify-center rounded-xl border border-hairline text-muted transition-colors hover:border-accent/60 hover:text-accent"
              >
                <GitHub className="size-5" aria-hidden="true" />
              </a>
              <a
                href={personalInfo.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abdur Razzak Sakib on LinkedIn"
                className="inline-flex size-11 items-center justify-center rounded-xl border border-hairline text-muted transition-colors hover:border-accent/60 hover:text-accent"
              >
                <LinkedIn className="size-5" aria-hidden="true" />
              </a>
              <a
                href="#contact"
                aria-label="Go to the Contact section"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-hairline px-4 text-sm font-medium text-muted transition-colors hover:border-accent/60 hover:text-accent"
              >
                <Mail className="size-5" aria-hidden="true" />
                Email me
              </a>
            </div>
          </Reveal>
        </div>

        {/* Photo */}
        <Reveal delay={0.25} y={32} className="mx-auto w-full max-w-sm lg:max-w-none">
          <div className="group relative mx-auto max-w-[22rem] lg:max-w-[26rem]">
            {/* Offset accent frame behind the photo */}
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-3 translate-y-3 rounded-[1.75rem] border border-accent/40 bg-surface"
            />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-hairline bg-surface">
              <Image
                src={personalInfo.profilePhoto.src}
                alt={personalInfo.profilePhoto.alt}
                width={512}
                height={640}
                priority
                sizes="(min-width: 1024px) 26rem, 22rem"
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>

            {/* Small code-inspired detail */}
            <div className="absolute -bottom-6 left-1/2 w-fit -translate-x-1/2 rounded-xl border border-hairline bg-elevated px-4 py-2.5 font-mono text-xs text-muted shadow-lg shadow-background/60 sm:left-auto sm:right-4 sm:-bottom-5 sm:translate-x-0">
              <span className="text-accent">const</span> role ={" "}
              <span className="text-foreground">&quot;fullstack&quot;</span>;
            </div>
          </div>
        </Reveal>
      </div>

    </section>
  );
}
