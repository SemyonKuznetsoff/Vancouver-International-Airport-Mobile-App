# Future Screen Prompt Template

Paste this template into Claude when building any new screen. Replace the
`{{placeholders}}` with the specifics for the screen you're building.

---

```
You are working inside my YVR app project only:

C:\Users\semyo\yvr-app

Do not touch any folder outside this path. Do not run git commands. Do not
commit. Do not push. Do not create a new Next.js project.

Read CLAUDE.md, docs/design-system.md, and docs/screen-build-checklist.md
before writing code. Follow every rule in them.

Task: Build the {{SCREEN_NAME}} screen from this Figma frame.

Figma frame:
{{FIGMA_URL}}

Inspect the frame via the Figma MCP (get_design_context). Pull the layout,
spacing, typography, hierarchy, and component structure. Do not write code
until the inspection is done.

Route to create:
src/app/{{ROUTE_PATH}}/page.tsx

Screen purpose (in one sentence):
{{ONE_SENTENCE_PURPOSE}}

Primary action of this screen:
{{ONE_MAIN_ACTION}}

Content hierarchy:
- Eyebrow: {{EYEBROW_OR_NONE}}
- Heading: {{HEADING_TEXT_WITH_ITALIC_ACCENT}}
- Supporting line: {{SUPPORTING_LINE_OR_NONE}}
- Body / cards: {{BULLETED_LIST_OF_CONTENT_BLOCKS}}
- Primary CTA: {{PRIMARY_CTA_LABEL}} → {{CTA_DESTINATION}}
- Secondary CTA (optional): {{SECONDARY_CTA_OR_NONE}}

Component reuse rules (MUST follow):
- Wrap in <AppShell>.
- Non-root screens MUST use <ScreenHeader backHref="..." step="...">.
- Use <Heading size="display"> for hero screens, <Heading size="title">
  for step / detail screens.
- Use <Eyebrow> for uppercase labels.
- Use <Card> for any glass card chrome. Do not author the card chrome inline.
- Use <Button variant="primary"> for the one main CTA at the bottom in a
  `mt-auto` block. Use <Button variant="ghost"> for secondary text-link CTAs.
- Use inline SVGs in icons.tsx. Add new icons there if missing.
- Reuse PermissionCard, AuthOption, FeatureList, BrandMark, IconTile where
  applicable.

Consistency rules:
- Spacing: only 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. No off-scale values.
- Page horizontal gutter: px-6 (24px).
- Section vertical gap: mt-8 (32px) between major sections.
- Colors: semantic tokens only, never raw hex.
- Shadows: token-based, never inline literals.
- Radii: token-based (--radius-pill, --radius-panel, --radius-card,
  --radius-chip).
- Tap targets ≥ 44×44.
- One <h1> per page (provided by <Heading>).
- Icon-only buttons get aria-label. Toggles use role="switch" aria-checked.
- No "use client" unless the screen has interactive state.

Build command:
After writing the page, run:
npm run build

Fix every TypeScript / lint / build error before reporting done.

Summary requirements:
- Files created
- Files changed
- Route added
- Components reused
- New primitives added (if any, with a doc update)
- Any assumptions
- What to visually check at localhost:3000

Do not commit. Do not push.
```

---

## Example: filled-in template (Home dashboard)

```
You are working inside my YVR app project only:

C:\Users\semyo\yvr-app

Do not touch any folder outside this path. Do not run git commands. Do not
commit. Do not push. Do not create a new Next.js project.

Read CLAUDE.md, docs/design-system.md, and docs/screen-build-checklist.md
before writing code. Follow every rule in them.

Task: Build the Home Dashboard (no-trip-yet state) screen.

Figma frame:
https://www.figma.com/design/m5IQ9eySFMzfVghIPezL56/YVR-Mobile-App?node-id=...

Inspect the frame via the Figma MCP (get_design_context). Pull the layout,
spacing, typography, hierarchy, and component structure. Do not write code
until the inspection is done.

Route to create:
src/app/home/page.tsx

Screen purpose (in one sentence):
Greet the user and offer one clear way to add their first trip.

Primary action of this screen:
"Add a flight" — tapping opens the flight-search screen.

Content hierarchy:
- Eyebrow: GOOD MORNING
- Heading: Welcome to YVR.
- Supporting line: Add a flight to start your journey.
- Body / cards:
  - Flight search input (rounded card)
  - Two small status cards: Security wait, Parking availability
- Primary CTA: Add a flight → /flights/new
- Secondary CTA: none

[...continues as above]
```
