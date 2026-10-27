import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  centered?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: SectionHeadingProps) {
  return (
    <Reveal>
      <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
        <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
          {eyebrow}
        </p>
        <h2 className="text-section-heading mt-3 font-bold">{title}</h2>
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}
