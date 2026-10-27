/**
 * Central place for personal contact details and profile links.
 * Update this file if any of these change.
 */
export const personalInfo = {
  name: "Abdur Razzak Sakib",
  title: "Full-Stack Web Developer",
  email: "abdurrazzaqsakib@gmail.com",
  whatsapp: {
    label: "01876271346",
    url: "https://wa.me/8801876271346",
  },
  github: {
    url: "https://github.com/mdsakibdev",
  },
  linkedin: {
    url: "https://www.linkedin.com/in/abdurrazzak1",
  },
  profilePhoto: {
    /** Local copy of the LinkedIn profile photo. Replace this file to update the photo. */
    src: "/images/profile.png",
    alt: "Portrait photo of Abdur Razzak Sakib",
  },
  resume: {
    /** Real resume PDF, generated from scripts/resume/resume.html via scripts/generate-resume.mjs. */
    path: "/resume.pdf",
  },
} as const;
