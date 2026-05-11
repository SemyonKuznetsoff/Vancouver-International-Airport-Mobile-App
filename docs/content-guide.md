# YVR Content Guide

The single source of truth for app copy. If a screen's text disagrees
with this doc, the doc wins — fix the text.

> Companion docs: [`design-system.md`](./design-system.md) for visual
> language, [`screen-build-checklist.md`](./screen-build-checklist.md)
> for per-screen verification.

The job of every line of copy in YVR is the same: **help a tired
traveller decide what to do next, in 2–3 seconds, without raising
their pulse.** When in doubt, cut words.

---

## 1. Voice

YVR sounds like a **calm, well-informed concierge at a quiet front
desk** — not an app, not a marketing brochure, not a friendly chatbot.

- **Calm.** Tone never escalates beyond the situation. A gate change
  is a fact, not an emergency.
- **Expert.** Names things precisely ("Gate D73", "transborder
  security"). Never vague.
- **Concise.** Trim every word that doesn't change the reader's next
  action. "Begin your journey." not "Tap here to begin your journey."
- **Never panicked.** Even time-critical copy ("Boarding now") uses a
  level voice — urgency comes from the timing, not the punctuation.
- **Never overly playful.** No exclamation marks. No "Woohoo!", no
  emoji decoration, no winking parentheticals.
- **Never generic marketing.** Cut "premium", "seamless", "best-in-class",
  "elevate your experience", "revolutionary". These say nothing.
- **Canadian English** for user-facing copy ("metres", "centre",
  "favourite"). Code identifiers stay American (`color`, `center`).

**Voice in one sentence:** Quiet, factual, useful — the way you'd
want to be spoken to when you've been awake for 18 hours.

---

## 2. Copy rules

Apply in order; if a line breaks one rule, fix that line.

1. **One main idea per screen.** If a screen needs two, it should be
   two screens. (Same as design-system §9.)
2. **Short headings.** Two lines max at the design width (375px). One
   line is better. An italic accent inside the heading counts as
   part of the line.
3. **Body copy: 1–2 lines when possible.** Card body max two lines at
   13px / 1.55. If it doesn't fit, the copy is too long — rewrite,
   don't expand the card.
4. **CTAs are verb-first.** "Begin your journey" not "Get started".
   "Add a flight" not "Flight addition". "Continue with Apple" not
   "Sign in via Apple".
5. **No unnecessary explanations.** If the user already knows what
   tapping a button does, don't tell them. "Continue" is enough.
6. **No airport jargon unless useful.** "Wayfinding" is useful and
   precise. "Indoor positioning system" is not. "Pre-clearance" is
   useful (real thing). "Real-time intelligence" is marketing fluff.
7. **Avoid anxiety-heavy wording.** No "Hurry!", "Last chance!",
   "Don't miss your flight!". The traveller is already anxious; the
   app's job is to lower that pulse, not raise it.
8. **Reassurance only when backed by useful info.** Never write
   "Don't worry, everything's fine." Do write "You have 52 min to
   spare." The fact is the reassurance.
9. **No marketing puff.** If a line could appear on any travel app's
   home screen, it doesn't belong on a YVR screen.
10. **Match the screen's purpose to the screen's verb.** Onboarding
    screens *invite*. Status screens *inform*. Action screens *direct*.
    Mixing verbs creates noise.

---

## 3. Status copy patterns

The status pill / banner uses the **shortest** factual phrase. If the
user needs to know *more*, the supporting line under the pill carries
the detail.

| Status | Pill copy | Supporting line | Visual cue |
|---|---|---|---|
| On time | `On time` | — | success dot |
| Delayed | `Delayed 40 min` | New time, e.g. "Departs 15:30" | warning dot |
| Gate changed | `Gate changed` | New gate, e.g. "Now boarding at D73" | warning dot, optional `role="alert"` |
| Boarding soon | `Boarding soon` | Time, e.g. "Boards 13:50" | info dot |
| Boarding now | `Boarding now` | Gate + zone, e.g. "Gate D73 · Zone 4" | success dot, `role="alert"` |
| Final call | `Final call` | Gate, e.g. "Gate D73" | danger dot, `role="alert"` |
| Connection on track | `Connection on track` | Time spare, e.g. "52 min to spare" | success dot |
| Connection tight | `Tight connection` | Time spare, e.g. "18 min to spare" | warning dot |
| Connection at risk | `Connection at risk` | What to do, e.g. "Head to D73 now" | danger dot, `role="alert"` |
| Security wait low | `Security wait 8 min` | — | success dot |
| Security wait high | `Security wait 32 min` | "Allow extra time" | warning dot |
| Parking available | `Parking available` | "Lot C, B, D" | success dot |
| Parking almost full | `Parking almost full` | "Lot C only" | warning dot |
| Parking full | `Parking full` | "Nearby alternatives below" | danger dot |
| Route updated | `Route updated` | Reason, e.g. "Elevator out of service" | info dot |
| Permission denied | `Permission needed` | What's blocked + how to enable | neutral, link to settings |
| Offline / API down | `We can't reach live updates` | "Try again in a moment" | neutral / danger banner |

**Status-copy rules:**

- Lead with the **fact**, not the implication. "Delayed 40 min" not
  "Your flight is running late by approximately 40 minutes."
- Numbers come right after the label, no preposition. "Delayed 40
  min" not "Delayed by 40 min".
- Use a single `·` (middle dot, U+00B7) as the in-line separator
  inside dense status lines, never `|` or `-` or `/`.
- When the status implies action, the supporting line states the
  action. "Connection at risk" → "Head to D73 now".
- Never combine two status states in one pill. If a flight is both
  delayed and has changed gates, the warning pill says
  "Gate changed" (the more time-critical fact); the delay appears
  in the body.

---

## 4. Error messages

Every error answers three questions, in order:

1. **What's happening?** (calm title, no blame)
2. **What did the system try?** (short explanation, optional — skip if obvious)
3. **What can the user do?** (useful next action)

**Pattern:**

```
<Title — fact, not blame>
<Description — 1 line of context + next step>
[<Primary action — verb-first>]
```

**Examples:**

| ❌ Bad | ✅ Good |
|---|---|
| Network error. | We can't reach live airport updates right now. Try again in a moment. |
| Sign-in failed. | We couldn't sign you in. Check your connection and try again. |
| Location denied. | YVR needs location to find your gate. Enable it in iOS Settings. |
| Something went wrong. | Boarding pass didn't load. Try again or open it in your wallet. |
| Error 503 Service Unavailable. | Live updates are paused for maintenance. We'll show what we have. |
| Failed to fetch flights. | We can't show your flights right now. Try again in a moment. |

**Don't:**

- Don't blame the user ("You entered an invalid…").
- Don't blame "the network" without giving an action ("Network down."
  is not actionable; "Try again in a moment." is).
- Don't show technical codes ("HTTP 500", "TypeError"). Log them,
  don't surface them.
- Don't apologise more than once per screen ("Sorry, we couldn't…
  Sorry for the inconvenience…"). Once at most, and usually never.

**Retry-label conventions:**

| Context | Label |
|---|---|
| Network fetch failed | `Try again` |
| Sign-in failed | `Try again` (not "Retry sign-in") |
| Flight data stale | `Reload flights` |
| Map tiles failed | `Reload map` |
| Boarding pass | `Reload pass` |

---

## 5. Empty states

Empty states are **invitations**, not apologies. The tone says
"there's nothing here *yet*", not "there's nothing here, sorry."

**Pattern:**

```
<Title — short, present-tense>
<Description — one line, sets context + path forward>
[<Primary CTA — what to do next>]
```

**Examples:**

| Context | Title | Description | Primary CTA |
|---|---|---|---|
| No trips yet | `No trips yet` | Add a flight to start your journey. | `Add a flight` |
| No saved places | `No saved places` | Save lounges and gates you visit often. | `Browse the map` |
| No notifications | `You're all caught up` | We'll let you know about gate changes and delays. | — |
| No search results | `Nothing matched` | Try a different terminal or airline. | `Clear filters` |
| No nearby services | `Nothing within reach` | Move closer to a concourse to see services. | `Open the map` |
| No connection saved | `No connecting flight saved` | Add it to track timing between flights. | `Add connection` |

**Empty-state rules:**

- Title uses **present tense**, not future ("No trips yet" — there
  are no trips *now*; "you'll add some" is implied).
- Description names the **value of having content** there, not the
  emptiness itself. "Save lounges you visit often" tells the user
  what *saving* gives them.
- CTA is the **direct next step**, never "Get started" or "Learn
  more". Use the verb that creates content.
- "You're all caught up" is reserved for **inbox / notification**
  empty states where the absence of content is positive. Don't reuse
  the phrase elsewhere.

---

## 6. Time, units, and airport formatting

Consistency here is the difference between "premium" and "amateur".
Pick one format per concept and never mix.

### Airport codes

- **Always 3 uppercase letters.** `YVR`, `SFO`, `LHR`. Never
  lowercase, never with periods.
- A code on its own line is fine ("YVR → SFO"). A code mid-sentence
  doesn't get the airport name appended: "Departing YVR at 14:15",
  not "Departing Vancouver (YVR) at 14:15".
- Arrows between codes use `→` (U+2192), not `->` or `>`.

### Gates

- **`Gate D73`** — word `Gate`, single space, letter + number, no
  hyphen, no dash.
- Concourse alone: `Concourse D`.
- Gate change copy: `Now boarding at D73` (drop "Gate" when the
  context already implies it).

### Time

- **24-hour, colon-separated.** `14:15`, `06:40`. Never `2:15 PM`,
  never `14h15`.
- Boarding time: `Boards 13:50`. Departure: `Departs 14:15`.
- Arrival: `Arrives 15:30`.
- Avoid showing seconds.
- For relative time in the next hour, use minutes: `in 12 min` (not
  `in 0:12`).
- For relative time more than an hour out, use the absolute time:
  `at 14:15` (not `in 2 hours 8 min`).

### Durations

- **`min`** is the abbreviation for minutes. Always lowercase. Always
  a single space before the unit.
- `8 min`, `40 min`, `90 min`. Never `8 minutes`, `8m`, `8mins`,
  `8 min.`.
- Use `min` everywhere in the app **without exception**, including
  in body copy. The single exception is when the word "minutes"
  reads more naturally in narrative onboarding copy — but if you're
  writing onboarding narrative, ask before using it.
- For hours, use `h` (lowercase, no space): `2h 15`. The minutes are
  bare digits, not `min`.

### Distance and walking time

- Metric. `420 m`, `1.2 km`. Single space before unit, lowercase
  unit.
- Walking time: `8 min walk` (not `8-min walk`, not `Walking 8 min`).
- Distance and walking-time together: `420 m · 8 min walk`.

### Money and currency (forward-looking)

- Canadian dollars by default: `$24` for whole, `$24.50` for cents.
  No `CAD` suffix unless the screen also shows USD or another
  currency.
- US dollars use `US$24` when shown alongside CAD on the same screen.

### Examples in context

```
YVR → SFO
Boards 13:50 · Gate D73
Delayed 40 min · Departs 15:30

Security wait 8 min
Parking available · Lot C, B, D

Walk to D73
420 m · 8 min walk
```

### Forbidden formats

- `2:15 PM` (use 24-hour)
- `14h15` (use colon)
- `8 minutes`, `8mins`, `8m`, `8min` (use `8 min`)
- `420 metres`, `420 meters`, `420m` (use `420 m`)
- `Gate-D73`, `gate D73`, `Gate D-73` (use `Gate D73`)
- `yvr`, `Yvr`, `Y.V.R.` (use `YVR`)
- `Vancouver (YVR)` mid-sentence (use `YVR`)

---

## 7. Permission and trust language

Permission prompts are a moment of doubt. Copy should answer the
question the user is silently asking — *what's in this for me, and
what does YVR get to see?* — in **two lines**.

### Pattern

```
<Title — the capability, in plain words>
<Description — what the user gets from enabling it>
<Footer micro-label — the reassurance, factual>
```

### Location

| Slot | Copy |
|---|---|
| Title | `Indoor wayfinding` |
| Description | `Find your gate, lounges, and services.` |
| Footer | `USED ONLY AT YVR` |

Reassurance lines (pick one per surface, never stack):

- `Your location stays on this device.`
- `Only used while you're at YVR.`
- `Never shared with airlines.`

### Notifications

| Slot | Copy |
|---|---|
| Title | `Flight alerts` |
| Description | `Boarding, delays, and gate changes.` |
| Footer | `QUIET DURING QUIET HOURS` |

Reassurance lines:

- `Only what you need to act on.`
- `Muted during quiet hours.`
- `Off when you're not flying.`

### Apple / Google sign-in

| Slot | Copy |
|---|---|
| Primary label | `Continue with Apple` |
| Primary label | `Continue with Google` |
| Trust line below the group | `Stored on your device. Never shared.` |
| Ghost CTA | `I already have an account` |

**Sign-in rules:**

- Use `Continue with X`, not `Sign in with X`. "Continue" assumes
  the user is mid-flow, which is more inviting than "Sign in".
- Never list more than three provider options. If a fourth is added,
  collapse the least-common ones under `More sign-in options`.
- Trust line sits **below the provider group**, not under each row.

### Generic data-security reassurance

Used in any settings / onboarding screen that explains data handling:

- `Anonymous when not signed in.`
- `Cancel anytime in Settings.`
- `Your trips never leave your device.`
- `Used to keep you on time. Nothing else.`

**Rules:**

- Always **factual**. Don't write "Your data is safe with us" — that
  says nothing. Write what specifically *doesn't* happen.
- One trust line per surface. Stacking three reassurances reads as
  defensive.
- All caps for the footer micro-label, sentence case for the
  description. Period at end of full sentences; no period on the
  footer label.

---

## 8. Quick reference (cheat sheet)

The 10 rules to keep in front of you while writing any screen:

1. One main idea per screen.
2. Two lines maximum for headings.
3. Body: 1–2 lines.
4. CTAs verb-first ("Add a flight", not "Flight addition").
5. No marketing puff ("premium", "seamless", "best-in-class").
6. Status: lead with the fact ("Delayed 40 min"), not the implication.
7. Errors: title + 1-line context + verb-first retry. Never blame.
8. Empty states are invitations, not apologies.
9. Time: `14:15`. Duration: `40 min`. Distance: `420 m`. Walk:
   `8 min walk`. Gates: `Gate D73`.
10. Trust copy is factual ("Stays on this device"), never reassuring
    in the abstract ("Safe with us").

When unsure: **cut the line in half and re-read it.** If it still
makes sense, the cut version is the copy.
