/**
 * Every piece of copy and data the site renders. Kept in one place so the
 * sections stay presentational and the facts stay editable.
 */

export const PROFILE = {
  name: "Mithilesh KS",
  roles: ["Developer", "Designer"],
  location: "Chennai, India",
  timezone: "Asia/Kolkata",
  coordinates: "13.0827° N / 80.2707° E",
  email: "mithileshofficial06@gmail.com",
  available: true,
  blurb:
    "Aspiring full stack developer with a solid grasp of building practical applications in Python, FastAPI, Next.js and PostgreSQL — with a cybersecurity habit that keeps the edges tight.",
};

export const SOCIALS = [
  { label: "GitHub", href: "https://github.com/mithileshofficial06" },
  { label: "LinkedIn", href: "https://linkedin.com/in/mithilesh06" },
  { label: "Email", href: `mailto:${PROFILE.email}` },
];

export const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

/**
 * The statement that opens the About section. Kept as one string and left to
 * wrap on its own — hard-coded line breaks re-wrapped at real widths and left
 * an orphan on every line.
 */
export const ABOUT_STATEMENT =
  "I can take a system from a blank repo to deployed and under real load. I'm most useful in the part in the middle — where correctness stops being obvious.";

export const ABOUT_BODY = [
  "I'm a computer science undergraduate at LICET, Chennai. I work across TypeScript, Python, Postgres and Solidity, and I'm comfortable anywhere in the stack — interface, API, queue, schema, contract. I'd rather own a system end to end than hold one layer of it well.",
  "What I'm actually good at is the unglamorous middle: making a pipeline safe to run twice, keeping the logic that decides something small enough to test, and knowing which half of a problem a model should be nowhere near. I learn a domain before I model it.",
];

export const STATS = [
  { value: 36, suffix: "", label: "Public repositories" },
  { value: 6, suffix: "", label: "Featured builds" },
  { value: 3, suffix: "", label: "Hackathon entries" },
  { value: 2028, suffix: "", label: "Graduating", plain: true },
];

export type Project = {
  index: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  year: string;
  kind: string;
  repo: string;
  live?: string;
  accolade?: string;
};

/** Six featured builds, newest first. */
export const PROJECTS: Project[] = [
  {
    index: "01",
    name: "JuriSync",
    tagline: "Finding undertrial prisoners the law already says are free",
    description:
      "Section 479 of the BNSS entitles an undertrial who has served half their maximum sentence to release on bond. Nobody checks that systematically across thousands of cases. JuriSync runs the check daily — AI reads the unstructured charge sheets, a fixed auditable formula decides eligibility, and a DLSA lawyer confirms before anything is filed.",
    stack: ["Next.js 16", "TypeScript", "Prisma", "Supabase", "Argon2", "JWT"],
    year: "2026",
    kind: "Legal tech",
    repo: "https://github.com/mithileshofficial06/Justify-Sync",
    live: "https://justify-sync.vercel.app",
  },
  {
    index: "02",
    name: "ScholarShield",
    tagline: "Scholarship fraud risk-triage for college committees",
    description:
      "An entity-resolution and contradiction-detection engine that reads scholarship applications, cross-references them against each other, and orders them for human review. Document forensics is a secondary signal. It flags review order — there is no code path by which the system approves, rejects or accuses anyone.",
    stack: ["Next.js", "TypeScript", "Express", "BullMQ", "FastAPI", "PostgreSQL", "Redis"],
    year: "2026",
    kind: "Civic AI",
    repo: "https://github.com/mithileshofficial06/scholar-shield",
  },
  {
    index: "03",
    name: "Zyro",
    tagline: "Inventory-aware dynamic liquidity as a native SwapVM instruction",
    description:
      "Market makers quote around the market mid and bleed out when one-directional flow leaves them holding a falling asset. The fix — quoting around your own reservation price — has been known since Avellaneda & Stoikov in 2008, but never worked on-chain because a pool's inventory belongs to everybody. 1inch Aqua exposes per-maker balance; Zyro is the instruction that reads it and re-centres the quote.",
    stack: ["Solidity", "TypeScript", "1inch SwapVM", "The Graph", "Uniswap"],
    year: "2026",
    kind: "DeFi",
    repo: "https://github.com/mithileshofficial06/zyro",
    accolade: "ETHOnline 2026",
  },
  {
    index: "04",
    name: "VaxiTrack",
    tagline: "Immunization tracking that calls the parents a clinic would lose",
    description:
      "India's Universal Immunization Programme puts twenty-eight vaccines in a child's first years, and the doses that get missed are missed by the families nobody has time to chase. VaxiTrack generates the full schedule per child, marks what falls past due, and runs the follow-up itself — a daily job placing Twilio voice calls in Indian English and SMS, each message written for that parent. Health workers scan a QR at the centre to record what was actually given.",
    stack: ["Next.js 15", "React 19", "FastAPI", "MongoDB", "Twilio", "Gemini 2.0 Flash", "APScheduler"],
    year: "2026",
    kind: "Public health",
    repo: "https://github.com/mithileshofficial06/VaxiTrack",
    accolade: "Top 10 · Ctrl+Alt+Hack",
  },
  {
    index: "05",
    name: "InboxIQ",
    tagline: "Gmail analytics with a retrieval layer over your own mail",
    description:
      "Connects over Google OAuth, syncs mail through a background queue, then classifies, scores sentiment and embeds every message so it can be searched by meaning rather than keyword. A RAG chat sits on top, answering questions about your own inbox against retrieved context.",
    stack: ["Next.js 16", "Express", "FastAPI", "Llama 3.3 70B", "NVIDIA NIM", "BullMQ", "Redis"],
    year: "2026",
    kind: "AI product",
    repo: "https://github.com/mithileshofficial06/InboxIQ",
    live: "https://inbox-iq-frontend-three.vercel.app",
  },
  {
    index: "06",
    name: "CodeMap",
    tagline: "See the architecture of any codebase, instantly",
    description:
      "Paste a GitHub URL and get the repository's structure back as an interactive graph — modules, dependencies and entry points laid out with D3, annotated by Gemini so the diagram explains itself instead of just drawing itself.",
    stack: ["Next.js 14", "TypeScript", "Express", "D3.js", "Gemini API", "Turborepo"],
    year: "2026",
    kind: "Developer tool",
    repo: "https://github.com/mithileshofficial06/codemap",
    live: "https://codebase-api.vercel.app",
  },
];

/** The short case, six panels of it. */
export const WHY = [
  {
    index: "01",
    title: "A security lens, always on",
    short: "Security lens",
    body: "I read my own code the way someone attacking it would. Google's cybersecurity certificate, Burp and ZAP in the toolchain, and a CLI scanner I wrote myself — the habit came before any job asked for it.",
  },
  {
    index: "02",
    title: "Tested outside the classroom",
    short: "Proven in public",
    body: "Hackathon rooms at IIT Madras, a live demo at the U.S. Consulate in Chennai, a sponsored track at ETHOnline. The work has been judged by people with no reason to be kind about it.",
  },
  {
    index: "03",
    title: "No handoffs",
    short: "No handoffs",
    body: "Interface, API, queue, schema, contract — I carry a build across all of them. Three of the six projects on this page are deployed and hold a public URL, not a screenshot.",
  },
  {
    index: "04",
    title: "New tools don't slow me down",
    short: "Fast ramp",
    body: "Snap's Lens Studio and AR from a standing start to a demo stage. Solidity and an on-chain instruction set for ETHOnline. The ramp is the job, not an obstacle before it.",
  },
  {
    index: "05",
    title: "Builds well with strangers",
    short: "Collaboration",
    body: "A hackathon is three days with people you met at the door. I say what I'm taking early, pick up the unglamorous half, and make sure nobody is waiting on me.",
  },
  {
    index: "06",
    title: "Design is part of the build",
    short: "Design",
    body: "How a thing looks is how it gets judged, long before anyone reads the source. I would rather spend the extra hour on the interface than explain why it was optional.",
  },
];

export const STACK_GROUPS = [
  {
    title: "Languages",
    items: ["TypeScript", "Python", "JavaScript", "Java", "SQL", "Solidity"],
  },
  {
    title: "Frontend",
    items: ["Next.js", "React", "Tailwind CSS", "Motion", "GSAP", "D3.js", "HTML / CSS"],
  },
  {
    title: "Backend & data",
    items: ["Node.js", "Express", "FastAPI", "Flask", "PostgreSQL", "MongoDB", "Prisma", "Redis", "BullMQ"],
  },
  {
    title: "Security",
    items: ["Burp Suite", "Nmap", "Wireshark", "OWASP ZAP", "Nuclei", "Subfinder"],
  },
  {
    title: "Tooling",
    items: ["Git", "GitHub", "Linux", "Vercel", "Supabase", "Turborepo", "Docker"],
  },
];

export type TimelineKind = "Education" | "Certification" | "Recognition";

export const TIMELINE: {
  kind: TimelineKind;
  period: string;
  title: string;
  org: string;
  note: string;
}[] = [
  {
    kind: "Education",
    period: "2024 — 2028",
    title: "B.E. Computer Science Engineering",
    org: "Loyola-ICAM College of Engineering and Technology, Chennai",
    note: "Currently in the third year.",
  },
  {
    kind: "Certification",
    period: "2025",
    title: "Google Cybersecurity Certificate",
    org: "Google · Coursera",
    note: "Threat models, network defence and the tooling underneath AISA.",
  },
  {
    kind: "Recognition",
    period: "2026",
    title: "Top 10 — Ctrl+Alt+Hack",
    org: "VaxiTrack",
    note: "AI immunization tracking with voice reminders for low-connectivity families.",
  },
  {
    kind: "Recognition",
    period: "2026",
    title: "U.S. Consulate × Snap",
    org: "NaviLens AR",
    note: "Augmented reality city discovery built on Snap's AR platform.",
  },
  {
    kind: "Recognition",
    period: "2026",
    title: "ETHOnline",
    org: "Zyro",
    note: "Sponsored by 1inch, The Graph and the Uniswap Foundation.",
  },
];

export const MARQUEE_ITEMS = [
  "Next.js",
  "React",
  "TypeScript",
  "Python",
  "FastAPI",
  "PostgreSQL",
  "Tailwind CSS",
  "Prisma",
  "Express",
  "Redis",
  "Solidity",
  "D3.js",
  "Supabase",
  "Burp Suite",
  "Nmap",
  "Linux",
];
