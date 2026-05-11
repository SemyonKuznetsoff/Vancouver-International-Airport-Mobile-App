@AGENTS.md

# YVR Mobile App — Claude Instructions

This file is the permanent operating guide for Claude when working in this repo.
Read it before writing or editing code. If a rule here conflicts with anything in
your training data, the rule here wins.

---

## 1. Project purpose

YVR is a mobile-first web app — a calm, premium airport concierge for travellers
moving through Vancouver International. The interface must reduce stress: surface
the next useful thing, hide everything else. Built in Next.js (App Router) +
TypeScript + Tailwind v4. Mobile is the primary form factor; desktop is a
centred phone-width column.

## 2. Visual style principles

- Calm, quiet, premium. Never busy, never loud.
- Aurora pastel background (flat gradient, never live `filter: blur`).
- Navy primary text on pale mist surfaces.
- Generous whitespace. Generous line-height.
- Italic accent inside the heading is the signature flourish — use sparingly,
  one italic phrase per screen.
- iOS-inspired hierarchy. Rounded pill CTAs, rounded glass cards.

## 3. Mobile-first layout rules

- Design and build at **375px reference width** first.
- Cap layout at **max-w-[430px]** on larger viewports (handled by `AppShell`).
- Always wrap a screen in `<AppShell>`. Never reinvent the shell.
- Horizontal page gutter: `px-6` (24px). No exceptions outside cards.
- Safe-area insets are handled by `AppShell` — do not re-add `env(safe-area-*)`.
- The bottom CTA must live in a `mt-auto` block so it sits above the home
  indicator on long-content screens.
- **Never ship the Figma phone bezel chrome** (outer 50px radius + ring +
  shadow + status bar mock + home indicator bar). Those are mockup-only.

## 4. Typography rules

- Family: Plus Jakarta Sans (loaded via `next/font/google` in `layout.tsx`).
- Use the `<Heading>` component for every screen title. Use the `size` prop:
  - `display` (34px) — Screen 1 / hero screens.
  - `title` (30px) — Step / detail / dialog screens.
- Use `<Eyebrow>` for the small uppercase label above headings.
- Body text: 14px / line-height 1.55, `--color-text-secondary`.
- Metadata / captions: 11–12px. Never go below 11px.
- Italic accent: place inside `<em>` within `<Heading>`. One italic clause max.
- No multiple display-size headings on the same screen.

## 5. Color token rules

- Always reference tokens, never raw hex.
- Semantic tokens (preferred): `--color-bg`, `--color-surface`,
  `--color-surface-elevated`, `--color-text-primary`, `--color-text-secondary`,
  `--color-text-muted`, `--color-action-primary`, `--color-action-primary-fg`,
  `--color-border`, `--color-border-soft`, `--color-success`,
  `--color-warning`, `--color-danger`, `--focus-ring`.
- The aurora hues (`--color-aurora-*`) are background-only. Do not use them
  for text, borders, or icons.
- Status colors (success / warning / danger) are reserved for live data
  states (gate change, delay, security wait). Do not use them decoratively.

## 6. Spacing scale rules

Use **only** values from this scale:

```
4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64
```

When to use what:

| value | usage |
|---|---|
| 4 | gap between an icon and adjacent text |
| 8 | gap between tightly related items in a row |
| 12 | gap between sibling cards in a stack |
| 16 | internal card spacing between text blocks |
| 20 | card padding on compact cards |
| 24 | page horizontal gutter, generous card padding |
| 32 | gap between major sections on a screen |
| 40 | hero-to-content gap |
| 48 | optional larger hero rhythm |
| 64 | top safe-area-plus-eyebrow rhythm for step screens |

**Forbidden:** off-scale values (17, 22, 27, 29, 31…). The only allowed
exceptions are (a) values inside a token (e.g. `--radius-panel: 22`) which
must be documented in `docs/design-system.md`, or (b) pixel-perfect Figma
matches that you flag in the PR description.

## 7. Radius and shadow rules

- Radii live in tokens: `--radius-card` (24), `--radius-panel` (22),
  `--radius-chip` (10), `--radius-pill` (9999).
- Shadows live in tokens: `--shadow-button`, `--shadow-card`, `--shadow-panel`.
- Never inline a custom shadow with `shadow-[0_8px_32px…]`. If you need a new
  shadow, add a token first.

## 8. Button rules

- Use the `<Button>` component for every CTA. Do not build raw `<button>`s
  for primary actions.
- Variants:
  - `primary` — full-width, 54px tall, navy pill, white text, trailing icon
    optional. One per screen.
  - `ghost` — 44px text-link style for "I already have an account" etc.
- Touch target minimum: 44×44. Buttons hit this by default; raw `<button>`s
  must opt in (`h-11 w-11` or larger).
- Pass `href` to render as `<Link>` (client navigation). Otherwise it renders
  as `<button>`.
- Focus state is handled globally. Do not override.
- Disabled state: `opacity-50 pointer-events-none` (no custom styling yet).

## 9. Card rules

- Use the `<Card>` primitive for every glass card. Do not re-author the
  `bg-white/40 + border + shadow + radius` chrome inline.
- Padding: `p-5` (20px) by default. Override via `padding` prop only when
  the design demands it.
- Cards stack with `gap-3` (12px) between siblings.
- Card titles use 15px / SemiBold; bodies use 13px / Medium.
- Keep card body ≤ 2 short lines. If it needs more, the screen is doing too
  much.

## 10. Icon sizing rules

- Standard inline icon: **16px**.
- Body / metadata icon (before a 11–12px caption): **12px**.
- Tile icon (inside a 28–40px chip): **14–18px**.
- Brand / hero icon: never larger than 24px inline.
- Stroke width: 1.75 (already baked into `strokeProps` in `icons.tsx`).
- Decorative icons: `aria-hidden` (default in our `icons.tsx`).
- Meaningful icons in interactive elements: pair with an accessible label
  on the button/link, not on the SVG.

## 11. Navigation and safe-area rules

- Every non-root screen has a `<ScreenHeader>` with a back link and an
  optional `step` label. Do not build the back button by hand.
- Back targets follow the navigation graph in `docs/design-system.md`.
- The status bar (`9:41` clock, signal/battery) is rendered by the device
  OS on real mobile — **do not render a fake one**.
- The home indicator is rendered by the OS — do not render a fake one.

## 12. Accessibility rules

- One `<h1>` per page (provided by `<Heading>` when `as="h1"`).
- Cards are `<article>`. Sections are `<section>`.
- Every icon-only button needs `aria-label`.
- Every toggle uses `role="switch" aria-checked` and `aria-label`.
- Focus is handled globally in `globals.css` — leave it alone unless adding
  a non-standard interactive element.
- Respect `prefers-reduced-motion` — handled globally.
- Tap targets: ≥44×44.

## 13. Component reuse rules

Reuse, before you build new:

| need | use |
|---|---|
| App layout shell | `AppShell` |
| Background | `AuroraBackground` (already inside `AppShell`) |
| Screen title | `Heading` with `size="display"` or `size="title"` |
| Uppercase label above title | `Eyebrow` |
| Brand lockup | `BrandMark` |
| Numbered feature row list | `FeatureList` |
| Glass card chrome | `Card` |
| Header with back + step | `ScreenHeader` |
| Primary / ghost CTA | `Button` |
| Permission row with toggle | `PermissionCard` |
| Auth provider row | `AuthOption` + `AuthOptionGroup` |
| Inline SVG | add to `icons.tsx`, never import external images |

If a screen needs something that doesn't fit, propose a new primitive in
`docs/design-system.md` first — do not invent one-off styles in a page file.

## 14. Do not do this

- ❌ Do not run `npx create-next-app` — the project is already scaffolded.
- ❌ Do not commit or push without an explicit user request.
- ❌ Do not amend prior commits.
- ❌ Do not edit the parallel folder at
  `C:\Users\semyo\OneDrive\Desktop\YVR App\yvr-app` — that's a stale copy.
- ❌ Do not add dark mode tokens until brand has signed off a dark palette.
- ❌ Do not introduce CSS-in-JS, styled-components, MUI, shadcn, or any
  other styling system. Tailwind v4 + CSS variables only.
- ❌ Do not introduce a state library (Redux, Zustand, Jotai). Local
  `useState` + Server Components are sufficient for the current scope.
- ❌ Do not introduce icon libraries (lucide, hero-icons). Inline SVGs in
  `icons.tsx`.
- ❌ Do not render the Figma phone bezel chrome.
- ❌ Do not use `live filter: blur`. Use radial gradients.
- ❌ Do not author off-scale spacing.
- ❌ Do not add `!important` to override Heading or Button — extend the
  component instead.

## 15. Pre-build checklist (every new screen)

Before writing JSX:

1. Read the Figma frame via MCP (`get_design_context`).
2. Open `docs/design-system.md` and identify every token + component that
   maps to the design.
3. List which existing primitives cover the screen. Note any gap.
4. If a gap needs a new primitive, write a 3-line proposal in the system
   doc and pause to confirm with the user.
5. Confirm the route path with the user.

## 16. Post-build checklist (every new screen)

After writing JSX:

1. Run `npm run build`. Fix every error and every warning.
2. Open the screen at 375px in DevTools — content fits, no horizontal scroll.
3. Open at 1280px — column caps at 430px, centred.
4. Tab through with the keyboard — every interactive element shows the
   navy focus ring.
5. Toggle `prefers-reduced-motion` — no animations longer than instant.
6. Cross-check: no inline shadows, no off-scale spacing, no raw hex, no
   `!important`, no missing `aria-label` on icon-only controls.
7. Summarise files created + changed for the user.
8. Do not commit unless asked.
