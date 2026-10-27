export interface ProjectData {
  slug: string;
  name: string;
  tagline: string;
  /** Short description shown on the featured-projects card. */
  description: string;
  /** Longer overview shown on the details page. */
  overview: string;
  /** The problem / purpose the project addresses. Only kept when verifiable. */
  purpose: string | null;
  /** Verified key features. `null` means not enough verified information. */
  features: string[] | null;
  /** Verified from the repository's package.json / README. */
  technologies: string[];
  /** Local screenshot of the live site, shown below /public. */
  screenshot: string;
  screenshotAlt: string;
  links: {
    live: string;
    github: string;
  };
}

export const projects: ProjectData[] = [
  {
    slug: "bangla-news-24",
    name: "Bangla News 24",
    tagline: "Bangla news portal",
    description:
      "A Bangla-language news portal where readers can browse the latest articles across dedicated categories such as politics, world, economy, health, sports, and technology.",
    overview:
      "Bangla News 24 is a full-stack news portal built with the Next.js App Router. The site presents current Bangla news articles in a clean, newspaper-style layout with a running latest-news ticker, dedicated category pages, individual article pages, and user accounts for signing in and signing up.",
    purpose: null,
    features: [
      "Homepage with the latest news presented in a marquee ticker",
      "Dedicated category pages: politics, world, economy, health, sports, technology, and video",
      "Individual news article pages",
      "Sign-in and sign-up flows",
      "Privacy policy and terms pages",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "daisyUI",
      "Better Auth",
      "MongoDB",
    ],
    screenshot: "/projects/bangla-news-24.png",
    screenshotAlt: "Homepage of the Bangla News 24 news portal",
    links: {
      live: "https://bangla-news24-two.vercel.app/",
      github: "https://github.com/mdsakibdev/Bangla-News-24",
    },
  },
  {
    slug: "bazar-dor",
    name: "Bazar Dor",
    tagline: "Commodity price tracker",
    description:
      "A Bangla web app for tracking daily commodity prices in Bangladesh — with price trend indicators, category-based browsing, market-by-market comparison, and user accounts.",
    overview:
      "Bazar Dor helps people keep track of daily prices of essential commodities such as rice, oil, fish, meat, vegetables, and fruit. Prices are presented with rising and falling indicators, can be filtered by category and sorted, and are broken down by individual retail markets so users can compare markets before they buy. The whole interface is in Bangla and is designed mobile-first.",
    purpose:
      "Daily commodity prices in Bangladesh change constantly and are scattered across different markets. Bazar Dor brings them together in one place, so a shopper can check today's price, see whether it went up or down, and compare markets before buying.",
    features: [
      "Price trends and highlights with rising/falling indicators that update daily",
      "Dynamic category browsing and sorting (rice, oil, fish, meat, vegetables, fruit, and more)",
      "Market breakdown and analytics comparing prices across retail markets",
      "Email/password authentication plus Google and GitHub login via Better Auth",
      "Fully Bangla interface with a mobile-first, responsive design",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "daisyUI",
      "Better Auth",
      "MongoDB",
      "Cloudflare Workers API",
    ],
    screenshot: "/projects/bazar-dor.png",
    screenshotAlt: "Homepage of the Bazar Dor commodity price tracker",
    links: {
      live: "https://bazar-dor-sable.vercel.app/",
      github: "https://github.com/mdsakibdev/Bazar-Dor",
    },
  },
  {
    slug: "verdant-table",
    name: "Verdant Table",
    tagline: "Catering business website",
    description:
      "A full-service catering business website with a services showcase, a featured menu with individual dish pages, a product shop, a cart, and a quote-request flow.",
    overview:
      "Verdant Table is a showcase website built for a catering business concept. It highlights catering services, presents a featured menu with per-dish detail pages, offers a shop with products, and includes a cart and a quote/plan-your-event contact flow — all wrapped in a polished, fully responsive marketing layout.",
    purpose: null,
    features: [
      "Services showcase covering event types from weddings to corporate catering",
      "Featured menu section with individual dish detail pages",
      "Product shop with a cart flow",
      "About section and a quote-request contact flow",
      "Fully responsive marketing layout",
    ],
    technologies: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Better Auth",
      "MongoDB",
    ],
    screenshot: "/projects/verdant-table.png",
    screenshotAlt: "Homepage of the Verdant Table catering website",
    links: {
      live: "https://verdant-table-puce.vercel.app/",
      github: "https://github.com/mdsakibdev/Verdant-Table",
    },
  },
];

export function getProject(slug: string): ProjectData | undefined {
  return projects.find((project) => project.slug === slug);
}
