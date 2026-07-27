# Editorial Workshop Refinement Design

## Goal

Refine the approved editorial digital workshop homepage so its hierarchy, interactions, and details feel intentional and trustworthy. The pass corrects the issues found in review, adds a more compelling process story, and preserves the existing Cloudflare Pages static-export deployment, contact form, and Calendly booking path.

## Information Architecture and Numbering

- Reorder the homepage after the hero to: Services, Portfolio, Process, FAQ, About, Contact.
- Number Services `01`, Portfolio `02`, Process `03`, About `04`, and Contact `05`.
- Keep the existing primary navigation order, which already begins with Services and then Portfolio.
- Keep the standalone route content consistent with the same section numbers and components.

## Hero Business Card Cue

- Keep the existing tap, click, keyboard, and horizontal-drag card flip.
- Add a small visible curved arrow and concise `flip` cue close to the card edge so the interaction is discoverable without dominating the hero.
- The cue is decorative support for the existing accessible button label and screen-reader instructions.
- The cue follows the card's editorial line-work and uses the orange accent for contrast.

## Services Interaction

- Convert the five service rows into a single-open accessible accordion.
- No service is permanently highlighted on initial render; each row begins closed with a plus icon.
- Selecting a row opens its `Best for` detail, turns that row blue, and changes its icon to a minus.
- Selecting the open row closes it. Selecting a different row closes the previous row and opens the new one.
- Use semantic buttons with `aria-expanded` and `aria-controls`, full-row pointer targets, visible focus treatment, and keyboard activation.
- Animate only the detail reveal, colour transition, and plus/minus change. Avoid layout-heavy effects.

## Portfolio Corrections

- Move the section number from `01` to `02`.
- Render the opening and closing quotation marks as separate blue elements using matching size, baseline, and spacing.
- Remove the redundant `Read the case study` link while retaining `View the live website`.
- Remove the lower `Editorial digital workshop` decorative rail and close the resulting excess vertical space.

## Process Timeline Redesign

### Composition

- Keep a compact, full-width landscape composition on desktop: four equal stages joined by one continuous hand-drawn timeline.
- Preserve the editorial paper texture, large `03` marker, headline, and the reassurance line `You always know what happens next.`
- Replace the current generic diagrams with four coherent workshop-style SVG illustrations:
  1. Consultation: notes, goals, audience, and project constraints gathered around a conversation marker.
  2. Design direction: a blueprint-style page or hut framework showing the approved visual direction before build.
  3. Build and launch: a responsive browser/device composition with testing and launch checkpoints.
  4. Ongoing support: monitoring, updates, hosting, and measured improvements shown as a continuing path.
- Give each stage a short practical description and a distinct trust-building outcome so the section explains the process rather than acting only as decoration.

### Motion Sequence

- Use Framer Motion as a direct project dependency for the timeline animation.
- Trigger the sequence once when the process composition enters the viewport.
- Draw the main path from left to right first using SVG path-length animation.
- As the line reaches each node, reveal its number, title, illustration, description, and outcome in sequence.
- Trace a restrained subset of each illustration's SVG strokes to create the blueprint/hand-drawn effect without making every line compete for attention.
- Finish with orange handwritten annotations and the final reassurance line.
- Target an overall duration of approximately 3–4 seconds. The completed timeline remains static and does not replay while scrolling within the same page visit.
- Keep movement purposeful: stroke drawing, opacity, and small position changes only.

### Responsive Behaviour

- Desktop and wide tablet: retain the single four-stage landscape row.
- Small screens: use a compact two-by-two connected layout rather than four tall stacked cards, keeping page length controlled and text readable.
- Do not shrink the desktop artwork into illegible miniature diagrams or require horizontal page scrolling.

### Motion Safety

- With `prefers-reduced-motion: reduce`, render the completed timeline immediately with no drawing sequence or delayed content.
- All meaningful process information remains ordinary HTML; animated SVGs are decorative and hidden from assistive technology.

## FAQ Restoration

- Restore all six existing FAQ entries on the homepage and standalone FAQ route.
- Keep the existing accessible accordion behaviour and dark editorial treatment.
- Use the canonical questions from `content/faq.ts` without index-based wording overrides.

## About Corrections

- Restore three prominent orange directional arrows alongside the three `What you can expect` commitments.
- Treat the arrows as a repeated visual rhythm aligned with each statement, not as tiny text glyphs.
- Preserve the existing founder portrait, credibility statistics, and direct-contact message.

## Contact and Footer Corrections

- Change the handwritten contact promise to: `I reply to you personally as soon as I can.`
- Preserve the current working contact form, Cloudflare Turnstile handling, and Calendly booking link.
- Make the footer `THE DESIGN HUTCH` wordmark use the same type treatment as the header lockup, including its body font, uppercase styling, and letter spacing.

## Cloudflare Pages and Performance

- Preserve the Next.js static export and Cloudflare Pages output. No server-only animation or rendering API is introduced.
- Framer Motion runs only in the client-side process component and does not change the contact function or deployment configuration.
- Keep static content server-rendered where interaction is not required. Isolate client state to Services, the business card, the existing accordion, and the process timeline.
- Animate transforms, opacity, SVG stroke properties, and lightweight colour changes; avoid continuous background animation and layout thrashing.

## Verification

- Write or update Playwright tests before implementation for homepage ordering and numbering, service accordion interaction, restored FAQ count, revised contact copy, portfolio removals, and the business-card cue.
- Add process tests for the completed accessible content and reduced-motion state. Do not make tests depend on fragile animation timing.
- Run focused tests red, implement the smallest passing changes, then run lint, typecheck, production build, and the relevant end-to-end suites.
- Perform rendered QA at desktop and mobile widths, checking the one-time timeline reveal, service interactions, quote alignment, section order, overflow, focus states, console health, contact form, and Calendly link.

## Out of Scope

- Replacing Calendly, changing the contact API, altering Cloudflare security configuration, adding new portfolio projects, or rewriting the broader brand system.
- A scroll-scrubbed or vertically extended process experience.
