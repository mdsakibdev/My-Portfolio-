import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { MotionProvider } from "@/components/motion/motion-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const siteTitle = "Abdur Razzak Sakib — Full-Stack Web Developer";
const siteDescription =
  "Portfolio of Abdur Razzak Sakib, a Full-Stack Web Developer building modern, responsive, and user-friendly web applications with React, Next.js, Node.js, and MongoDB.";

// TODO: replace with the real production URL once the site is deployed on Vercel.
const siteUrl = "https://abdur-razzak-sakib-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s — Abdur Razzak Sakib",
  },
  description: siteDescription,
  keywords: [
    "Abdur Razzak Sakib",
    "Full-Stack Web Developer",
    "Next.js Developer",
    "React Developer",
    "Portfolio",
  ],
  openGraph: {
    type: "website",
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "Abdur Razzak Sakib — Portfolio",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Abdur Razzak Sakib — Full-Stack Web Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jakarta.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
