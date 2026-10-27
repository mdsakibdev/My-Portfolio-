import { BookOpen, Code, Compass, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";

const highlights = [
  {
    Icon: Code,
    title: "What I build",
    body: "Clean interfaces, reusable components, and modern web applications across frontend and backend.",
  },
  {
    Icon: Sparkles,
    title: "What I value",
    body: "Continuous learning, thoughtful design, readable code, and building useful digital products.",
  },
  {
    Icon: Compass,
    title: "Where I'm headed",
    body: "Growing as a developer and contributing to reliable, accessible, high-quality web applications.",
  },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-24 sm:py-28">
      <div className="container-site">
        <SectionHeading
          eyebrow="About Me"
          title={<span id="about-heading">Turning ideas into practical digital experiences</span>}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Narrative */}
          <Reveal>
            <div className="space-y-5 text-base leading-relaxed text-muted sm:text-lg">
              <p>
                Hi, I&rsquo;m{" "}
                <span className="font-medium text-foreground">Abdur Razzak Sakib</span>, a
                Full-Stack Web Developer interested in building modern, responsive, and
                user-friendly web applications.
              </p>
              <p>
                My development journey focuses on learning web technologies, improving my
                problem-solving skills, and turning ideas into practical digital experiences. I
                enjoy creating clean interfaces, building reusable components, exploring frontend
                and backend technologies, and understanding how complete web applications work.
              </p>
              <p>
                I&rsquo;m continuously working to improve my development skills through practical
                projects and hands-on learning. My goal is to grow as a developer and contribute
                to building reliable, accessible, and high-quality web applications.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-hairline bg-surface p-5">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent"
                >
                  <BookOpen className="size-5" />
                </span>
                <p className="text-sm leading-relaxed text-muted sm:text-base">
                  <span className="font-medium text-foreground">Academic background: </span>
                  completed master&rsquo;s-level education through a Qawmi Madrasa, with Arabic as
                  my field of study.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Highlight cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:content-start">
            {highlights.map(({ Icon, title, body }, index) => (
              <Reveal key={title} delay={0.08 * index}>
                <article className="h-full rounded-2xl border border-hairline bg-surface p-6 transition-colors duration-300 hover:border-accent/50">
                  <span
                    aria-hidden="true"
                    className="inline-flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent"
                  >
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
