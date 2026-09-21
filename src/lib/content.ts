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
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

/**
 * The statement that opens the About section. Kept as one string and left to
 * wrap on its own — hard-coded line breaks re-wrapped at real widths and left
 * an orphan on every line.
 */
export const ABOUT_STATEMENT =
  "I build things that have to hold up when someone actually depends on them — triage systems, legal tooling, security scanners. Software where being wrong has a cost.";

export const ABOUT_BODY = [
  "I'm a computer science undergraduate at LICET, Chennai, working mostly in TypeScript and Python. Most of what I build sits in the same place: a real process that is tedious, error-prone and quietly failing people, and a machine that can do the tedious half while a human keeps the decision.",
  "That shape shows up in the scholarship applications nobody has time to cross-check, and in the undertrial prisoners who are already entitled to release and stay in jail because nobody ran the arithmetic. I care about the part where the AI reads and the fixed rule decides — never the other way round.",
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
    index: "02",
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
    index: "05",
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
  {
    index: "06",
    name: "ECHO",
    tagline: "A browser arcade game about surviving your own past",
    description:
      "Every loop lasts ten seconds, then replays as a ghost alongside every loop before it. Collect orbs, avoid your past selves, and the soundtrack builds itself — a loop is exactly four bars at 96 BPM, and each living echo adds a layer to the track. Deterministic simulation, seeded RNG, server-verified leaderboard, and about 16 KB of JavaScript.",
    stack: ["TypeScript", "Canvas 2D", "WebAudio", "Vite", "Supabase"],
    year: "2026",
    kind: "Game",
    repo: "https://github.com/mithileshofficial06/echo",
  },
];

/** Everything else worth a line, including the older award-winning work. */
export const ARCHIVE = [
  {
    name: "VaxiTrack",
    note: "AI child immunization tracking with Twilio voice reminders",
    year: "2026",
    accolade: "Top 10 · Ctrl+Alt+Hack",
    repo: "https://github.com/mithileshofficial06/VaxiTrack",
  },
  {
    name: "NaviLens AR",
    note: "Augmented reality city discovery",
    year: "2026",
    accolade: "U.S. Consulate × Snap",
    repo: "https://github.com/mithileshofficial06/NaviLens",
  },
  {
    name: "Sayso",
    note: "Plain-English payroll as a self-halting onchain payment",
    year: "2026",
    accolade: "KeeperHub Agents Onchain",
    repo: "https://github.com/mithileshofficial06/sayso",
  },
  {
    name: "GraphOne",
    note: "Intelligence layer tracking AI companies, funding and investors",
    year: "2026",
    repo: "https://github.com/mithileshofficial06/graphone",
  },
  {
    name: "EduGenie",
    note: "Monitors Moodle, generates study material, delivers over email and WhatsApp",
    year: "2026",
    repo: "https://github.com/mithileshofficial06/edugenie",
  },
  {
    name: "Kalyana Konnection",
    note: "Role-based food surplus redistribution between events and NGOs",
    year: "2026",
    repo: "https://github.com/mithileshofficial06/KalyanaKonnection",
  },
  {
    name: "AISA",
    note: "CLI security analyst — recon, scanning and AI-written PDF reports",
    year: "2025",
    repo: "https://github.com/mithileshofficial06/AI-Security-Analyst-CLI-",
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

export const TIMELINE = [
  {
    period: "2024 — 2028",
    title: "B.E. Computer Science Engineering",
    org: "Loyola-ICAM College of Engineering and Technology, Chennai",
    note: "Currently in the third year.",
  },
  {
    period: "2025",
    title: "Google Cybersecurity Certificate",
    org: "Google · Coursera",
    note: "Threat models, network defence and the tooling underneath AISA.",
  },
  {
    period: "2026",
    title: "Top 10 — Ctrl+Alt+Hack",
    org: "VaxiTrack",
    note: "AI immunization tracking with voice reminders for low-connectivity families.",
  },
  {
    period: "2026",
    title: "U.S. Consulate × Snap",
    org: "NaviLens AR",
    note: "Augmented reality city discovery built on Snap's AR platform.",
  },
  {
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
