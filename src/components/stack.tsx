import {
  PROJECTS,
  STACK_GROUPS,
  STACK_LEVELS,
  type StackItem,
} from "@/lib/content";
import { TECH_ICONS } from "@/lib/tech-icons";

import { SectionHeading } from "./scroll-primitives";

/** Tools with no official mark of their own wear their initials instead. */
const MONOGRAMS: Record<string, string> = {
  SQL: "SQL",
  BullMQ: "BMQ",
  Nmap: "NM",
  Nuclei: "NC",
  Subfinder: "SF",
};

/**
 * Project stacks name the version they shipped against ("Next.js 16"); the
 * toolkit names the tool. Dropping a trailing version is what lets the two
 * lists meet without maintaining a third one by hand.
 */
const bare = (value: string) =>
  value.toLowerCase().replace(/\s+v?[\d.]+$/, "").trim();

const USED_IN = PROJECTS.reduce<Record<string, string[]>>((map, project) => {
  for (const tool of project.stack) {
    (map[bare(tool)] ??= []).push(project.name);
  }
  return map;
}, {});

const ALL = STACK_GROUPS.flatMap((group) => group.items);
const DAILY = ALL.filter((item) => item.level === 3).length;

/** How much of the toolkit each build actually draws on, heaviest first. */
const LISTED = new Set(ALL.map((item) => bare(item.name)));
const PER_BUILD = PROJECTS.map((project) => ({
  name: project.name,
  count: project.stack.filter((tool) => LISTED.has(bare(tool))).length,
})).sort((a, b) => b.count - a.count);

/** Three segments, filled to the level. The only quantity in the section. */
function Meter({ level }: { level: number }) {
  return (
    <span aria-hidden className="flex shrink-0 items-center gap-[3px]">
      {[1, 2, 3].map((step) => (
        <span
          key={step}
          className={`h-2.5 w-[3px] rounded-full ${
            step > level ? "bg-line" : "bg-ash"
          }`}
        />
      ))}
    </span>
  );
}

/**
 * The monogram is drawn inside the same 24x24 box as the brand paths, so a
 * tool without a mark draws identically.
 *
 * Sized by attribute rather than a utility class: an inline SVG carrying only
 * a viewBox expands to its container's full width the moment its CSS is
 * missing, which during development turns a 14px mark into a page-wide one.
 * The attributes are the floor; CSS still wins if it ever needs to.
 */
function Mark({ name, className }: { name: string; className: string }) {
  const path = TECH_ICONS[name];
  const monogram = MONOGRAMS[name] ?? name.slice(0, 2).toUpperCase();

  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
    >
      {path ? (
        <path d={path} fill="currentColor" />
      ) : (
        <text
          x="12"
          y="12.6"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="currentColor"
          fontFamily="var(--font-mono)"
          fontSize={monogram.length > 2 ? 7.4 : 10}
          letterSpacing="0.3"
        >
          {monogram}
        </text>
      )}
    </svg>
  );
}

/** One credit: the tool on the left of the gutter, its billing on the right. */
function Credit({ item }: { item: StackItem }) {
  const usedIn = USED_IN[bare(item.name)] ?? [];

  return (
    <div className="group mx-auto grid max-w-[44rem] grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] items-start gap-x-5 md:gap-x-8">
      <div className="flex items-center justify-end gap-2.5 pt-px">
        <h3 className="font-display text-ash group-hover:text-chalk text-right text-base leading-none tracking-[-0.03em] uppercase transition-colors duration-300 md:text-xl">
          {item.name}
        </h3>
        <Mark
          name={item.name}
          className="text-ash/75 group-hover:text-chalk shrink-0 transition-colors duration-300"
        />
      </div>

      <div>
        <div className="flex items-center gap-2.5">
          <Meter level={item.level} />
          <span className="label">{STACK_LEVELS[item.level]}</span>
        </div>

        <p className="text-smoke mt-1.5 max-w-[40ch] text-[12px] leading-[1.65] md:text-[13px]">
          {item.note}
        </p>

        {usedIn.length > 0 && (
          <p className="text-ash/65 mt-1.5 font-mono text-[9px] tracking-[0.14em] uppercase md:text-[10px]">
            {usedIn.join(" · ")}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * One pass of the list. Rendered twice inside the reel — the second copy is
 * decorative, there only so the roll has somewhere to go before it wraps.
 */
function Reel({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      aria-hidden={duplicate || undefined}
      className={duplicate ? "credits-dupe" : undefined}
    >
      {STACK_GROUPS.map((group) => (
        <div key={group.title}>
          <div className="mx-auto flex max-w-sm items-center gap-4 py-8">
            <span className="bg-line h-px flex-1" />
            <p className="label whitespace-nowrap">{group.title}</p>
            <span className="bg-line h-px flex-1" />
          </div>

          <div className="flex flex-col gap-7">
            {group.items.map((item) => (
              <Credit key={item.name} item={item} />
            ))}
          </div>
        </div>
      ))}

      {/* The slate the roll ends on before it comes round again. */}
      <div className="flex flex-col items-center gap-4 py-20">
        <span className="bg-line h-12 w-px" />
        <p className="label">End of list</p>
        <span className="bg-line h-12 w-px" />
      </div>
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The roll shows a three-segment meter against every tool without ever
 * saying what the segments mean, and a moving list is the wrong place to
 * explain it. The panel is where the notation, the totals and the shape of
 * the list stay still enough to read.
 */
function Panel() {
  const widest = Math.max(...STACK_GROUPS.map((group) => group.items.length));
  const learning = ALL.filter((item) => item.level === 1).length;

  return (
    <aside className="border-line flex flex-col gap-11 lg:border-l lg:pl-12">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="bg-chalk size-1.5 shrink-0 rounded-full" />
          <p className="label">Reel 03 · Toolkit</p>
        </div>

        <p className="text-smoke mt-5 max-w-[36ch] text-[13px] leading-[1.8]">
          Every entry carries the level I would actually claim in a room, not
          the one that reads best — {learning} of the {ALL.length} are still
          marked as learning, and the reel says so on the way past.
        </p>
      </div>

      <div>
        <p className="label">Reading the meter</p>
        <ul className="mt-5 flex flex-col gap-3.5">
          {([3, 2, 1] as const).map((level) => (
            <li key={level} className="flex items-center gap-3">
              <Meter level={level} />
              <span className="text-smoke flex-1 font-mono text-[10px] tracking-[0.14em] uppercase">
                {STACK_LEVELS[level]}
              </span>
              <span className="text-ash font-mono text-[10px] tabular-nums">
                {pad(ALL.filter((item) => item.level === level).length)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="label">By group</p>
        <ul className="mt-5 flex flex-col gap-3.5">
          {STACK_GROUPS.map((group) => (
            <li key={group.title} className="flex items-center gap-3">
              <span className="text-ash w-[6.5rem] shrink-0 truncate font-mono text-[10px] tracking-[0.1em] uppercase">
                {group.title}
              </span>
              <span className="bg-line h-[3px] flex-1 overflow-hidden rounded-full">
                <span
                  className="bg-ash block h-full rounded-full"
                  style={{
                    width: `${(group.items.length / widest) * 100}%`,
                  }}
                />
              </span>
              <span className="text-smoke font-mono text-[10px] tabular-nums">
                {pad(group.items.length)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="label">Drawn on per build</p>
        <ul className="mt-5 flex flex-col gap-3">
          {PER_BUILD.map((project) => (
            <li key={project.name} className="flex items-baseline gap-3">
              <span className="text-smoke shrink-0 font-mono text-[10px] tracking-[0.1em] uppercase">
                {project.name}
              </span>
              <span className="bg-line h-px flex-1" />
              <span className="text-ash shrink-0 font-mono text-[10px] tabular-nums">
                {pad(project.count)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export function Stack() {
  return (
    <section className="border-line/60 border-t py-24 md:py-36">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <SectionHeading
          id="stack"
          index="03"
          title="Toolkit"
          aside="What I reach for"
        />

        <p className="label mt-8">
          {ALL.length} tools · {DAILY} in daily rotation
        </p>

        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="credits-window relative h-[30rem] overflow-hidden md:h-[40rem]">
            <div className="animate-credits">
              <Reel />
              <Reel duplicate />
            </div>
          </div>

          <Panel />
        </div>
      </div>
    </section>
  );
}
