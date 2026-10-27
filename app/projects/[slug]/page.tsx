import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  CircleCheck,
  CircleAlert,
  ListChecks,
  Tag,
  Wrench,
} from "lucide-react";
import { FaGithub as GitHub } from "react-icons/fa6";
import { Reveal } from "@/components/motion/reveal";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { projects, getProject } from "@/lib/data/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): Array<{ slug: string }> {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: `${project.name} — Project Details`,
    description: project.description,
    openGraph: {
      title: `${project.name} — Abdur Razzak Sakib`,
      description: project.description,
      type: "article",
      images: [
        {
          url: project.screenshot,
          width: 1440,
          height: 1080,
          alt: project.screenshotAlt,
        },
      ],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const index = projects.findIndex((p) => p.slug === project.slug);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <Navbar />
      <main className="pt-28 sm:pt-32">
        <article className="container-site pb-24">
          {/* Breadcrumb */}
          <Reveal y={12}>
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-accent"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Projects
            </Link>
          </Reveal>

          {/* Header */}
          <header className="mt-6 max-w-3xl">
            <Reveal y={12}>
              <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                {project.tagline}
              </p>
              <h1 className="text-hero mt-3 font-bold">{project.name}</h1>
              <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
                {project.description}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-7 flex flex-wrap gap-4">
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-background transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                  View Live Website
                </a>
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-hairline px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/60 hover:text-accent"
                >
                  <GitHub className="size-4" aria-hidden="true" />
                  View on GitHub
                </a>
              </div>
            </Reveal>
          </header>

          {/* Screenshot */}
          <Reveal delay={0.15} y={28}>
            <figure className="mt-12 overflow-hidden rounded-3xl border border-hairline bg-surface">
              <Image
                src={project.screenshot}
                alt={project.screenshotAlt}
                width={1440}
                height={1080}
                priority
                sizes="(min-width: 1152px) 72rem, 100vw"
                className="w-full object-cover object-top"
              />
            </figure>
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-14">
            {/* Main content */}
            <div className="space-y-12">
              {/* Overview */}
              <Reveal>
                <section aria-labelledby="overview-heading">
                  <h2
                    id="overview-heading"
                    className="flex items-center gap-2.5 text-2xl font-bold sm:text-3xl"
                  >
                    <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
                    Project Overview
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
                    {project.overview}
                  </p>
                </section>
              </Reveal>

              {/* Problem / purpose */}
              <Reveal>
                <section aria-labelledby="purpose-heading">
                  <h2
                    id="purpose-heading"
                    className="flex items-center gap-2.5 text-2xl font-bold sm:text-3xl"
                  >
                    <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
                    Purpose of the Project
                  </h2>
                  {project.purpose ? (
                    <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
                      {project.purpose}
                    </p>
                  ) : (
                    <EditablePlaceholder>
                      Personal note to add: describe the problem this project solves and why you
                      built it (in your own words).
                    </EditablePlaceholder>
                  )}
                </section>
              </Reveal>

              {/* Features */}
              <Reveal>
                <section aria-labelledby="features-heading">
                  <h2
                    id="features-heading"
                    className="flex items-center gap-2.5 text-2xl font-bold sm:text-3xl"
                  >
                    <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
                    Key Features
                  </h2>
                  {project.features ? (
                    <ul className="mt-5 space-y-3">
                      {project.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <CircleCheck
                            className="mt-0.5 size-5 shrink-0 text-accent"
                            aria-hidden="true"
                          />
                          <span className="text-base leading-relaxed text-muted sm:text-lg">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EditablePlaceholder>
                      Personal note to add: list the main features you implemented (verified from
                      your own work).
                    </EditablePlaceholder>
                  )}
                </section>
              </Reveal>

              {/* Editable sections: challenges & improvements (cannot be invented from public sources) */}
              <Reveal>
                <section aria-labelledby="challenges-heading" className="space-y-6">
                  <h2
                    id="challenges-heading"
                    className="flex items-center gap-2.5 text-2xl font-bold sm:text-3xl"
                  >
                    <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
                    Development Notes
                  </h2>
                  <EditablePlaceholder>
                    <strong className="text-foreground">Development challenges: </strong>
                    Personal note to add — describe technical challenges you faced while building
                    this project.
                  </EditablePlaceholder>
                  <EditablePlaceholder>
                    <strong className="text-foreground">Possible improvements: </strong>
                    Personal note to add — describe features or refinements you plan for this
                    project so it accurately communicates your roadmap.
                  </EditablePlaceholder>
                </section>
              </Reveal>
            </div>

            {/* Sidebar meta */}
            <Reveal delay={0.1}>
              <aside className="space-y-4">
                <div className="rounded-2xl border border-hairline bg-surface p-6">
                  <h2 className="text-sm font-semibold tracking-[0.18em] text-muted uppercase">
                    Project Info
                  </h2>
                  <dl className="mt-4 space-y-4 text-sm">
                    <div>
                      <dt className="flex items-center gap-1.5 text-muted">
                        <Tag className="size-3.5" aria-hidden="true" /> Project type
                      </dt>
                      <dd className="mt-1 font-medium text-foreground">
                        Personal full-stack project
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1.5 text-muted">
                        <CircleCheck className="size-3.5" aria-hidden="true" /> Status
                      </dt>
                      <dd className="mt-1 font-medium text-foreground">
                        Live — deployed on Vercel
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1.5 text-muted">
                        <ListChecks className="size-3.5" aria-hidden="true" /> Technologies
                      </dt>
                      <dd className="mt-2 flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-hairline bg-elevated px-3 py-1 text-xs font-medium text-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-5 border-t border-hairline pt-4 text-xs leading-relaxed text-muted/80">
                    <Wrench className="mr-1.5 inline size-3.5 -translate-y-px" aria-hidden="true" />
                    Technology stack verified from the repository&rsquo;s{" "}
                    <span className="font-mono">package.json</span> and README.
                  </p>
                </div>
              </aside>
            </Reveal>
          </div>

          {/* Prev / Next navigation */}
          <nav
            aria-label="More projects"
            className="mt-16 grid gap-4 border-t border-hairline pt-10 sm:grid-cols-2"
          >
            <Link
              href={`/projects/${previous.slug}`}
              className="group rounded-2xl border border-hairline bg-surface p-6 transition-colors hover:border-accent/50"
            >
              <span className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                <ArrowLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden="true" />
                Previous project
              </span>
              <span className="mt-2 block text-lg font-semibold text-foreground">
                {previous.name}
              </span>
            </Link>
            <Link
              href={`/projects/${next.slug}`}
              className="group rounded-2xl border border-hairline bg-surface p-6 text-right transition-colors hover:border-accent/50 sm:text-right"
            >
              <span className="flex items-center justify-end gap-2 text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                Next project
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
              <span className="mt-2 block text-lg font-semibold text-foreground">
                {next.name}
              </span>
            </Link>
          </nav>
        </article>
      </main>
      <Footer />
    </>
  );
}

/**
 * Clearly-marked editable placeholder for information that is not verifiable
 * from public sources and must be filled in by the developer personally.
 */
function EditablePlaceholder({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-dashed border-hairline bg-elevated p-5">
      <CircleAlert className="mt-0.5 size-5 shrink-0 text-muted" aria-hidden="true" />
      <p className="text-sm leading-relaxed text-muted sm:text-base">{children}</p>
    </div>
  );
}
