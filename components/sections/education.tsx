import { FolderGit2, GraduationCap as GC, BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";

const education = {
  institution: "Qawmi Madrasa",
  field: "Arabic",
  level: "Master's-level education",
  status: "Completed",
};

interface PracticalRow {
  Icon: LucideIcon;
  title: string;
  body: string;
}

const practical: PracticalRow[] = [
  {
    Icon: FolderGit2,
    title: "Personal projects",
    body: "Designed and built complete web applications end-to-end, such as a Bangla news portal, a commodity price tracker, and a catering business website.",
  },
  {
    Icon: GC,
    title: "Hands-on learning",
    body: "Continuously improving skills through practical projects — from frontend interfaces to backend logic, databases, and authentication.",
  },
];

export function Education() {
  return (
    <section id="education" aria-labelledby="education-heading" className="py-24 sm:py-28">
      <div className="container-site">
        <SectionHeading
          eyebrow="Education"
          title={<span id="education-heading">Academic foundation</span>}
        />

        {/* Education card */}
        <Reveal>
          <ol className="mt-12">
            <li className="relative rounded-3xl border border-hairline bg-surface p-6 sm:p-8">
              {/* Timeline marker */}
              <span
                aria-hidden="true"
                className="absolute top-0 bottom-0 left-[2.4rem] hidden w-px bg-gradient-to-b from-accent/60 via-hairline to-transparent sm:block"
              />
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
                <span
                  aria-hidden="true"
                  className="relative inline-flex size-14 shrink-0 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent sm:ml-1.5"
                >
                  <GC className="size-6" />
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h3 className="text-xl font-semibold sm:text-2xl">{education.institution}</h3>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                      {education.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted sm:text-base">
                    Field of study: <span className="text-foreground">{education.field}</span>
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                    {education.level} — completed Arabic studies at a Qawmi Madrasa, building a
                    strong foundation in language, discipline, and structured learning.
                  </p>
                </div>
              </div>
            </li>
          </ol>
        </Reveal>

        {/* Practical experience — kept clearly separate from professional employment */}
        <div className="mt-16">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-2xl font-bold sm:text-3xl">Practical Experience</h3>
              <p className="text-sm text-muted">Personal projects & self-driven learning</p>
            </div>
          </Reveal>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {practical.map(({ Icon, title, body }, index) => (
              <Reveal key={title} delay={0.08 * index}>
                <article className="h-full rounded-2xl border border-hairline bg-surface p-6 transition-colors duration-300 hover:border-accent/50">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent"
                    >
                      <Icon className="size-5" />
                    </span>
                    <h4 className="text-lg font-semibold">{title}</h4>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="mt-4 text-xs text-muted/80">
              <BookOpen className="mr-1 inline size-3.5 -translate-y-px" aria-hidden="true" />
              Note: this reflects personal projects and hands-on learning, not professional
              employment.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
