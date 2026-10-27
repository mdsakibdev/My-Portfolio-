import type { IconType } from "react-icons";
import { SiGithub } from "react-icons/si";
import {
  SiCss,
  SiExpress,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { VscVscode as VSCode } from "react-icons/vsc";

export type SkillCategory = "Frontend Development" | "Backend & Database" | "Tools & Workflow";

export interface SkillTechnology {
  /** Technology name, displayed under the icon. */
  name: string;
  /** Category of the technology, used to group the cards. */
  category: SkillCategory;
  /** Genuine brand logo for the technology. */
  Icon: IconType;
  /** Official brand color, used to keep the logo recognizable on the dark theme. */
  color: string;
}

export const skillCategories: Array<{ label: SkillCategory; blurb: string }> = [
  {
    label: "Frontend Development",
    blurb: "Building fast, accessible, and responsive user interfaces.",
  },
  {
    label: "Backend & Database",
    blurb: "Powering applications with APIs, auth, and data.",
  },
  {
    label: "Tools & Workflow",
    blurb: "The everyday tools used to write, track, and ship code.",
  },
];

export const technologies: SkillTechnology[] = [
  // Frontend Development
  { name: "HTML5", category: "Frontend Development", Icon: SiHtml5, color: "#E34F26" },
  { name: "CSS3", category: "Frontend Development", Icon: SiCss, color: "#663399" },
  { name: "JavaScript", category: "Frontend Development", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "React", category: "Frontend Development", Icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", category: "Frontend Development", Icon: SiNextdotjs, color: "#FFFFFF" },
  { name: "TypeScript", category: "Frontend Development", Icon: SiTypescript, color: "#3178C6" },
  { name: "Tailwind CSS", category: "Frontend Development", Icon: SiTailwindcss, color: "#06B6D4" },

  // Backend & Database
  { name: "Node.js", category: "Backend & Database", Icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Express.js", category: "Backend & Database", Icon: SiExpress, color: "#FFFFFF" },
  { name: "MongoDB", category: "Backend & Database", Icon: SiMongodb, color: "#47A248" },
  { name: "PostgreSQL", category: "Backend & Database", Icon: SiPostgresql, color: "#699ECA" },

  // Tools & Workflow
  { name: "Git", category: "Tools & Workflow", Icon: SiGit, color: "#F05033" },
  { name: "GitHub", category: "Tools & Workflow", Icon: SiGithub, color: "#FFFFFF" },
  { name: "VS Code", category: "Tools & Workflow", Icon: VSCode, color: "#0098FF" },
];

export function technologiesByCategory(category: SkillCategory): SkillTechnology[] {
  return technologies.filter((tech) => tech.category === category);
}
