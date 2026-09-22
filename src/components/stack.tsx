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
 * tool without a mark scales identically off one `className`.
 */
function Mark({ name, className }: { name: string; className: string }) {
  const path = TECH_ICONS[name];
  const monogram = MONOGRAMS[name] ?? name.slice(0, 2).toUpperCase();

  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
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
    <div className="group mx-auto grid max-w-4xl grid-cols-[1fr_1.2fr] items-start gap-x-5 md:gap-x-10">
      <div className="flex items-center justify-end gap-2.5 pt-px">
        <h3 className="font-display text-ash group-hover:text-chalk text-right text-base leading-none tracking-[-0.03em] uppercase transition-colors duration-300 md:text-xl">
          {item.name}
        </h3>
        <Mark
          name={item.name}
          className="text-ash/60 group-hover:text-chalk size-3.5 shrink-0 transition-colors duration-300 md:size-4"
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
        <div key={group.title} className="px-6">
          <div className="mx-auto flex max-w-lg items-center gap-4 py-9">
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
      <div className="flex flex-col items-center gap-4 px-6 py-20">
        <span className="bg-line h-12 w-px" />
        <p className="label">End of list</p>
        <span className="bg-line h-12 w-px" />
      </div>
    </div>
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
      </div>

      {/* Full bleed: the roll is its own frame, and page gutters either side
          of it would read as a box rather than a window. */}
      <div className="credits-window relative mt-12 h-[30rem] overflow-hidden md:mt-16 md:h-[38rem]">
        <div className="animate-credits">
          <Reel />
          <Reel duplicate />
        </div>
      </div>
    </section>
  );
}
