import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { FaGithub as GitHub } from "react-icons/fa6";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/lib/data/projects";

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="border-y border-hairline bg-surface/40 py-24 sm:py-28"
    >
      <div className="container-site">
        <SectionHeading
          eyebrow="Featured Projects"
          title={<span id="projects-heading">Things I&rsquo;ve designed &amp; built</span>}
          description="Real, deployed applications — each card links to the live site, the source code, and a detailed case study."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={0.09 * index} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-hairline bg-surface transition-colors duration-300 hover:border-accent/50">
                <Link
                  href={`/projects/${project.slug}`}
                  className="relative block aspect-[16/10] overflow-hidden border-b border-hairline"
                  aria-label={`View details of ${project.name}`}
                >
                  <Image
                    src={project.screenshot}
                    alt={project.screenshotAlt}
                    fill
                    sizes="(min-width: 1280px) 22rem, (min-width: 768px) 40vw, 100vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </Link>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                    {project.tagline}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="transition-colors hover:text-accent"
                    >
                      {project.name}
                    </Link>
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>

                  {/* Technology chips (verified from each repository) */}
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Technologies used in ${project.name}`}>
                    {project.technologies.slice(0, 4).map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-hairline bg-elevated px-3 py-1 text-xs font-medium text-muted"
                      >
                        {tech}
                      </li>
                    ))}
                    {project.technologies.length > 4 ? (
                      <li className="rounded-full border border-hairline bg-elevated px-3 py-1 text-xs font-medium text-muted">
                        +{project.technologies.length - 4} more
                      </li>
                    ) : null}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-hairline pt-5">
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-opacity hover:opacity-80"
                    >
                      <ExternalLink className="size-4" aria-hidden="true" />
                      View Live
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
                    >
                      <GitHub className="size-4" aria-hidden="true" />
                      View Code
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-accent"
                    >
                      View Details
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
