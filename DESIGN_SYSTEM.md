# GearNest Design System

**"Basecamp Modern"** — an adventurous, clean, minimalist system. Warm earthy
neutrals, a deep-navy trail-dusk base for dramatic moments, and a single ember
accent that behaves like a campfire: used rarely, always to draw the eye to the
next action. Type is bold, condensed, and confident — like trail signage —
against generous whitespace. Motion is light: things settle into place as you
descend the page, nothing bounces or shouts.

## Color tokens

| Token | Hex | Role |
|-------|-----|------|
| `bone` | `#F6F3EE` | Page background (light) |
| `bone-2` | `#ECE6DB` | Cards / raised surfaces on light |
| `ink` | `#1E2A32` | Primary text; dark surfaces (hero, stats, footer) |
| `ink-2` | `#26333C` | Raised surface on dark |
| `moss` | `#55624A` | Olive — badges, secondary accents |
| `bark` | `#6B4E34` | Brown — earthy depth, gradients |
| `sand` | `#CDAA7D` | Tan — muted text on dark, borders |
| `ember` | `#E58A26` | **Accent only** — primary CTA, active, highlights |
| `ember-2` | `#C9741A` | Ember hover / pressed |

Rule: ember is the loudest color on the page and must stay scarce. If two
ember elements compete in one viewport, demote one.

## Typography

- **Display** — `Oswald` (600/700), condensed, uppercase for headings, hero,
  section titles, stat numbers, buttons. This carries the brand voice.
- **Body** — `Inter`, for paragraphs, labels, and UI copy. Clean and quiet.

Scale: hero `clamp(2.75rem, 8vw, 6rem)`; section title `text-3xl/4xl`; body
`text-sm/base`. Headings use tight tracking; small display labels use wide
tracking + uppercase.

## Surfaces & shape

- Light sections: `bone` background, `ink` text, `bone-2` cards with a hairline
  `ink/10` border.
- Dark sections (hero, stats, CTA band, footer): `ink` background, bone text,
  `sand` muted text, a faint white topographic texture (`.gn-topo`).
- Radius: cards `rounded-3xl` (24px), controls `rounded-xl` (12px), pills full.
- Elevation is soft and warm, never a hard black shadow.

## Motion (light)

- **Reveal**: sections fade + rise 18px on scroll-in (`<Reveal>`), staggered by
  small delays. 700ms, ease-out, once.
- **Hero**: slow ken-burns on the background (12s), gentle enough to feel alive.
- **Hover**: images scale 1.03, ember buttons lift 1px, icons nudge.
- All motion is disabled under `prefers-reduced-motion`.

## Components

- **Buttons** — primary: `ember` fill, ink text, uppercase display, soft ember
  shadow. Secondary: outline on current surface. Both `rounded-xl`.
- **Badge pill** — `moss` tinted, uppercase micro-label with a leading icon.
- **Value prop** — icon + bold label + one line of copy, in a 4-up row.
- **Stat** — big ember display number + uppercase sand label, on dark.
- **Category card** — earthy gradient, big icon, uppercase label bottom-left,
  arrow affordance; image drops in behind the gradient when available.

## Voice

Indonesian UI copy, short and outdoorsy. Tagline: **"Gear. Organized. Adventure
Ready."** / secondary **"Your Gear. Your Nest. Your Adventure."**
