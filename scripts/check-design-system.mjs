#!/usr/bin/env node
// Zero-dependency design-system rule scanner.
//
// Scans src/ for token-discipline and accessibility violations documented
// in docs/design-system.md, content-guide.md, and CLAUDE.md.
//
// Severity:
//   error   — high-confidence violation; fails --strict mode.
//   warning — heuristic or convention violation; reported in both modes,
//             does NOT fail --strict.
//
// Exit code:
//   default (reporter) — always 0; prints all findings grouped by rule.
//   --strict           — exits 1 if any *error* findings are present.
//                        Warnings still print but do not fail the run.
//                        Wire `--strict` into CI once the existing
//                        backlog is at zero errors.
//
// Run:   node scripts/check-design-system.mjs
//        npm run check:design-system
//        npm run check:design-system:strict
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

  // Inline `tracking-[Nem]` is acceptable in components where the role
  // token's letter-spacing differs from the design intent. The same four
  // files plus FeatureList (numbered-index tracking 0.05em) and the
  // sign-in page (OR-divider override at 0.22em + trust-line 0.025em)
  // qualify.
  "arbitrary-tracking": [
    "src/components/BrandMark.tsx",
    "src/components/Button.tsx",
    "src/components/AuthOption.tsx",
    "src/components/FeatureList.tsx",
    "src/app/onboarding/sign-in/page.tsx",
  ],
};

const CHECKS = [
  // ---------- ERRORS ----------
  {
    id: "raw-hex",
    severity: "error",
    why: "Raw hex color in JSX — consume a semantic token (--color-...) instead.",
    pattern: /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3}(?:[0-9a-fA-F]{2})?)?\b/,
  },
  {
    id: "arbitrary-text-px",
    severity: "error",
    why: "Arbitrary px font-size — use a type-role utility (text-display, text-title, text-body, text-body-sm, text-label, text-eyebrow, text-micro, text-section-title).",
    pattern: /text-\[\d+px\]/,
  },
  {
    id: "arbitrary-leading",
    severity: "error",
    why: "Arbitrary leading — the type-role utility carries line-height. Use the matching role.",
    pattern: /leading-\[[\d.]+\]/,
  },
  {
    id: "arbitrary-rounded-px",
    severity: "error",
    why: "Arbitrary rounded — use a --radius-* token via `rounded-[var(--radius-…)]`.",
    // Matches rounded-[Npx] / rounded-[N.5rem] / rounded-[50%] etc.
    // Allows rounded-[var(--radius-…)] via the negative lookahead.
    pattern: /rounded-\[(?!var\()[^\]]*\]/,
  },
  {
    id: "bg-white-opacity",
    severity: "error",
    why: "Inline bg-white/N — use --color-surface-card / --color-surface-hover / --color-surface-pressed / --color-surface-elevated-hover.",
    pattern: /bg-white\/\d+/,
  },
  {
    id: "inline-shadow",
    severity: "error",
    why: "Inline shadow literal — add a token in globals.css and consume it via shadow-[var(--shadow-...)].",
    pattern: /shadow-\[(?!var\(--shadow)/,
  },
  {
    id: "important",
    severity: "error",
    why: "!important is forbidden — extend the component instead.",
    pattern: /!important/,
  },
  {
    id: "duplicated-card-chrome",
    severity: "error",
    why: "Re-authoring Card chrome — use <Card> (optionally padding=\"none\") and compose inside.",
    // Three-token co-occurrence on one line = hand-rolled Card.
    pattern: /rounded-\[var\(--radius-panel\)\][^"`]*border-\[var\(--color-border\)\][^"`]*bg-\[var\(--color-surface-card\)\]/,
    allowFilesById: ["src/components/Card.tsx"],
  },
  {
    id: "loading-text-in-page",
    severity: "error",
    why: "One-off loading text in a page file — use <Button loading> or <Skeleton> instead. See screen-build-checklist.md.",
    pattern: /Loading\.{2,3}|Submitting\.{2,3}|Loading…|Submitting…/,
    onlyFiles: /^src\/app\/.*page\.tsx$/,
  },

  // ---------- WARNINGS (heuristic / convention) ----------
  {
    id: "arbitrary-tracking",
    severity: "warning",
    why: "Inline tracking — type-role tokens carry letter-spacing. Override only when intentional and document.",
    pattern: /tracking-\[[\d.\-]+em\]/,
  },
  {
    id: "icon-only-button-no-aria",
    severity: "warning",
    why: "Heuristic: a <button> appears to have only an *Icon child and no aria-label. Verify, and add an aria-label if missing.",
    multiline: true,
    // <button (no aria-label between < and the matching >) > <SomeIcon …/> </button>
    pattern: /<button(?:(?!aria-label|>)[^])*?>\s*<[A-Z]\w*Icon\s[^/>]*\/>\s*<\/button>/,
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

function lineColFromOffset(content, offset) {
  let line = 1;
  let column = 1;
  for (let i = 0; i < offset && i < content.length; i++) {
    if (content[i] === "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }
  return { line, column };
}

function truncate(text, max = 80) {
  const oneLine = text.replace(/\s+/g, " ");
  return oneLine.length > max ? `${oneLine.slice(0, max)}…` : oneLine;
}

const files = walk(ROOT);
const violations = [];

for (const file of files) {
  const norm = normalize(file);
  const content = readFileSync(file, "utf8");
  const lines = content.split(/\r?\n/);

  for (const check of CHECKS) {
    if (check.onlyFiles && !check.onlyFiles.test(norm)) continue;
    const allow =
      (ALLOW[check.id] && ALLOW[check.id].includes(norm)) ||
      (check.allowFilesById && check.allowFilesById.includes(norm));
    if (allow) continue;

    if (check.multiline) {
      // Scan whole content once.
      const flags = check.pattern.flags.includes("g")
        ? check.pattern.flags
        : `${check.pattern.flags}g`;
      const regex = new RegExp(check.pattern.source, flags);
      let m;
      while ((m = regex.exec(content)) !== null) {
        const { line, column } = lineColFromOffset(content, m.index);
        violations.push({
          file: norm,
          line,
          column,
          id: check.id,
          severity: check.severity,
          why: check.why,
          match: truncate(m[0]),
        });
        // Guard against zero-width matches.
        if (m.index === regex.lastIndex) regex.lastIndex += 1;
      }
    } else {
      for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(check.pattern);
        if (m) {
          violations.push({
            file: norm,
            line: i + 1,
            column: (m.index ?? 0) + 1,
            id: check.id,
            severity: check.severity,
            why: check.why,
            match: truncate(m[0]),
          });
        }
      }
    }
  }
}

const errors = violations.filter((v) => v.severity === "error");
const warnings = violations.filter((v) => v.severity === "warning");

const groupedErrors = new Map();
const groupedWarnings = new Map();
for (const v of errors) {
  if (!groupedErrors.has(v.id)) groupedErrors.set(v.id, []);
  groupedErrors.get(v.id).push(v);
}
for (const v of warnings) {
  if (!groupedWarnings.has(v.id)) groupedWarnings.set(v.id, []);
  groupedWarnings.get(v.id).push(v);
}

if (violations.length === 0) {
  console.log("design-system check: clean ✓");
  process.exit(0);
}

console.log(
  `design-system check: ${errors.length} error${errors.length === 1 ? "" : "s"}, ${warnings.length} warning${warnings.length === 1 ? "" : "s"}\n`,
);

function printGroup(grouped, label) {
  for (const [id, items] of grouped) {
    console.log(`[${label}] [${id}] ${items.length} occurrence${items.length === 1 ? "" : "s"}`);
    console.log(`  ${items[0].why}`);
    for (const v of items) {
      console.log(`  ${v.file}:${v.line}:${v.column}  "${v.match}"`);
    }
    console.log("");
  }
}

if (errors.length > 0) printGroup(groupedErrors, "error");
if (warnings.length > 0) printGroup(groupedWarnings, "warning");

if (STRICT) {
  if (errors.length > 0) {
    console.log(
      `Failed (--strict). ${errors.length} error${errors.length === 1 ? "" : "s"}; ${warnings.length} warning${warnings.length === 1 ? "" : "s"} ignored for the gate.`,
    );
    process.exit(1);
  }
  console.log(
    `Passed (--strict) with ${warnings.length} warning${warnings.length === 1 ? "" : "s"}. Warnings are non-blocking.`,
  );
  process.exit(0);
}

console.log(
  "(reporter mode — errors will fail --strict; warnings will not. See docs/design-system.md for migration patterns.)",
);
process.exit(0);
