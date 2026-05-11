#!/usr/bin/env node
// Zero-dependency design-system rule scanner.
//
// Scans src/ for known token-discipline violations documented in
// docs/design-system.md and CLAUDE.md. Reports file:line:column with the
// matching substring and the violated rule.
//
// Exit code:
//   default (reporter) — always 0, prints findings.
//   --strict           — exits 1 if any violation is found. Use in CI
//                        once the existing backlog is migrated.
//
// Run:   node scripts/check-design-system.mjs
//        npm run check:design-system
//        npm run check:design-system -- --strict

import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, posix, sep } from "node:path";

const ROOT = "src";
const args = new Set(process.argv.slice(2));
const STRICT = args.has("--strict");

/** Documented allow-list of files where a rule does not apply. */
const ALLOW = {
  // icons.tsx contains brand multicolour SVGs (Google logo, Aeroplan
  // gradient) whose hex values are licensed brand colours — kept literal
  // until replaced by licensed assets. See CLAUDE.md §8.
  "raw-hex": ["src/components/icons.tsx", "src/app/layout.tsx"],
  // Type-role utilities cover almost every text rendering. Four files
  // carry intentional inline px sizes:
  //   - BrandMark: bespoke uppercase brand lockup at 13px / 0.18em
  //     tracking — not a body role.
  //   - Button: variant typography is coupled to variant chrome (15px
  //     primary, 13px ghost). Documented in Button.tsx header.
  //   - icons.tsx AeroplanBadge: 10px monogram inside a brand badge —
  //     not a text-micro semantic.
  //   - AuthOption: row badge at 10px / 0.14em tracking — bespoke
  //     tighter tracking than text-micro provides.
  "arbitrary-text-px": [
    "src/components/BrandMark.tsx",
    "src/components/Button.tsx",
    "src/components/icons.tsx",
    "src/components/AuthOption.tsx",
  ],
};

const CHECKS = [
  {
    id: "raw-hex",
    why: "Raw hex color in JSX — consume a semantic token (--color-...) instead.",
    // Matches #fff, #ffffff, #ffffffff (with or without alpha).
    pattern: /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3}(?:[0-9a-fA-F]{2})?)?\b/,
  },
  {
    id: "arbitrary-text-px",
    why: "Arbitrary px font-size — use a type-role utility (text-display, text-title, text-body, text-body-sm, text-label, text-eyebrow, text-micro).",
    pattern: /text-\[\d+px\]/,
  },
  {
    id: "arbitrary-leading",
    why: "Arbitrary leading — the type-role utility carries line-height. Use the matching role.",
    pattern: /leading-\[[\d.]+\]/,
  },
  {
    id: "bg-white-opacity",
    why: "Inline bg-white/N — use --color-surface-card / --color-surface-hover / --color-surface-pressed.",
    pattern: /bg-white\/\d+/,
  },
  {
    id: "inline-shadow",
    why: "Inline shadow literal — add a token in globals.css and consume it via shadow-[var(--shadow-...)].",
    // Matches shadow-[...] except shadow-[var(--shadow-...)].
    pattern: /shadow-\[(?!var\(--shadow)/,
  },
  {
    id: "important",
    why: "!important is forbidden — extend the component instead.",
    pattern: /!important/,
  },
  {
    id: "duplicated-card-chrome",
    why: "Re-authoring Card chrome — use <Card> (optionally padding=\"none\") and compose inside.",
    // Two-pattern co-occurrence isn't doable line-by-line; this matches
    // the radius+border+surface-card triple on one line, which is the
    // diagnostic signature of a hand-rolled Card.
    pattern: /rounded-\[var\(--radius-panel\)\][^"`]*border-\[var\(--color-border\)\][^"`]*bg-\[var\(--color-surface-card\)\]/,
    allowFilesById: ["src/components/Card.tsx"],
  },
];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) {
      out.push(...walk(full));
    } else if (extname(full) === ".tsx" || extname(full) === ".ts") {
      out.push(full);
    }
  }
  return out;
}

function normalize(p) {
  return p.split(sep).join(posix.sep);
}

const files = walk(ROOT);
const violations = [];

for (const file of files) {
  const norm = normalize(file);
  const content = readFileSync(file, "utf8");
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const check of CHECKS) {
      const allow =
        (ALLOW[check.id] && ALLOW[check.id].includes(norm)) ||
        (check.allowFilesById && check.allowFilesById.includes(norm));
      if (allow) continue;
      const m = line.match(check.pattern);
      if (m) {
        violations.push({
          file: norm,
          line: i + 1,
          column: (m.index ?? 0) + 1,
          id: check.id,
          why: check.why,
          match: m[0],
        });
      }
    }
  }
}

const grouped = new Map();
for (const v of violations) {
  if (!grouped.has(v.id)) grouped.set(v.id, []);
  grouped.get(v.id).push(v);
}

if (violations.length === 0) {
  console.log("design-system check: clean ✓");
  process.exit(0);
}

console.log(
  `design-system check: ${violations.length} violation${violations.length === 1 ? "" : "s"} across ${grouped.size} rule${grouped.size === 1 ? "" : "s"}\n`,
);

for (const [id, items] of grouped) {
  console.log(`[${id}] ${items.length} occurrence${items.length === 1 ? "" : "s"}`);
  console.log(`  ${items[0].why}`);
  for (const v of items) {
    console.log(`  ${v.file}:${v.line}:${v.column}  "${v.match}"`);
  }
  console.log("");
}

if (STRICT) {
  console.log(`Failed (--strict). ${violations.length} violation(s).`);
  process.exit(1);
}

console.log(
  "(reporter mode — run with --strict to fail on these. See docs/design-system.md for migration patterns.)",
);
process.exit(0);
