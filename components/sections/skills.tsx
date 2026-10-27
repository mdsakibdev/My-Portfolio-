import type { IconType } from "react-icons";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import {
  skillCategories,
  technologiesByCategory,
  type SkillCategory,
} from "@/lib/data/technologies";

function TechnologyCard({
  name,
  Icon,
  color,
}: {
  name: string;
  Icon: IconType;
  color: string;
}) {
  return (
    <li className="group flex flex-col items-center gap-3 rounded-2xl border border-hairline bg-surface px-4 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:bg-elevated">
      <span
        className="flex size-12 items-center justify-center transition-transform duration-300 group-hover:scale-110"
        aria-hidden="true"
      >
        <Icon className="size-8" style={{ color }} />
      </span>
      <span className="text-sm font-medium text-foreground">{name}</span>
    </li>
  );
}

function CategoryBlock({
  label,
  blurb,
  index,
}: {
  label: SkillCategory;
  blurb: string;
  index: number;
}) {
  const techs = technologiesByCategory(label);

  return (
    <Reveal delay={0.08 * index}>
      <div className="rounded-3xl border border-hairline bg-surface/60 p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-xl font-semibold sm:text-2xl">{label}</h3>
          <p className="text-sm text-muted">{blurb}</p>
        </div>
        <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
          {techs.map(({ name, Icon, color }) => (
            <TechnologyCard key={name} name={name} Icon={Icon} color={color} />
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="border-y border-hairline bg-surface/40 py-24 sm:py-28"
    >
      <div className="container-site">
        <SectionHeading
          eyebrow="Skills & Technologies"
          title={<span id="skills-heading">Tools I use to build the web</span>}
          description="The languages, frameworks, databases, and tools I work with every day."
        />

        <div className="mt-12 space-y-6">
          {skillCategories.map((category, index) => (
            <CategoryBlock
              key={category.label}
              label={category.label}
              blurb={category.blurb}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
