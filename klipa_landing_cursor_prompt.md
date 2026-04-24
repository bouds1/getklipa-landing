# Klipa Landing Page — Cursor Build Prompt

**Purpose:** Paste this document (or relevant sections) into Cursor as the build brief for the Klipa landing page. It covers project context, brand system, section-by-section spec, integrations, and a ready-to-ship repo layout.

**Companion file:** `klipa_landing_mockup.html` — a working, standalone reference implementation of every section described below. Treat it as the visual source of truth. If the spec and the mockup disagree, the mockup wins unless the spec explicitly calls out a change.

---

## 1. Project Context

**What Klipa is:** A West Michigan grocery deals iOS app being built by Boudreau Ventures LLC. Pilot target March–May 2027. This page is a waitlist-only marketing site — no App Store links yet.

**Who it speaks to:** Two audiences, consumer-led.
- Primary: West Michigan shoppers who want a better way to shop sales at regional and independent grocers.
- Secondary: West Michigan regional grocery chains (partner prospects). Dark partner section near the bottom.

**Goal of the page:** Balanced — signup conversion plus credibility. The offer is simply "be first to know when it opens." No perks promised. No founder mention. No launch date on the page.

**Tone:** Warm hero / sharp proof. Cream-and-orange warmth up top, evidence-driven copy (BLS regional context, deal history, cross-store comparison) in the middle, dark authoritative block for partner pitch.

**Brand vocabulary — use precisely:**
| Term | Pronunciation | Meaning |
|------|--------------|---------|
| Klip (verb) | klip | Save/activate a deal |
| Klips (noun) | klips | A user's saved deals |
| Klipd (past tense) | klipt | Redeemed at checkout |
| Klipings (noun) | klip-ingz | Accumulated dollar savings |
| Kliping (verb, pres.) | klip-ing | In the act of saving |

Never substitute "save"/"saved"/"savings" unless explicitly asked.

---

## 2. Tech Stack & File Layout

**Stack — keep it lean:**
- Static HTML/CSS/JS. No framework. No build step.
- `Inter` via Google Fonts (`400, 500, 600`).
- Tally embeds for both the waitlist and partner-inquiry forms.
- Hosted on Vercel, repo in GitHub. DNS via Cloudflare (DNS-only, no proxy) → `getklipa.com`.

**Recommended repo structure:**

```
/ (repo root)
├── index.html
├── /assets
│   ├── klipa_logo.png           # transparent-bg variant, 512px+ wide
│   └── favicon.ico
├── /styles
│   └── main.css                 # extract CSS from mockup <style> block
├── /scripts
│   └── main.js                  # reveal + dynamic date JS from mockup
├── robots.txt
└── sitemap.xml
```

Single-page site. No routing. No analytics on v1 (add Vercel Web Analytics or Plausible later if needed — do not add GA4 without a cookie banner.)

---

## 3. Brand System

**Colors (use CSS custom properties — already declared in the mockup `:root`):**

| Token | Hex | Use |
|---|---|---|
| `--orange` | `#e85d04` | Primary brand, CTAs, accents |
| `--orange-dark` | `#c24d04` | CTA hover |
| `--orange-tint` | `#fbe4d4` | Savings pill background |
| `--orange-tint-border` | `#f5d4b8` | Vocab card border |
| `--orange-deep-text` | `#8a3a02` | Text on orange-tint |
| `--cream` | `#FDF6EE` | Hero + vocab section background |
| `--cream-border` | `#EDE5D9` | Section dividers on cream |
| `--surface` | `#F5F3EF` | Coverage strip + deal teaser background |
| `--white` | `#FFFFFF` | Page default + card fills |
| `--ink` | `#1F1A17` | Primary text |
| `--body` | `#4A443F` | Body copy |
| `--muted` | `#76706B` | Captions, form placeholders |
| `--muted-strong` | `#8A847E` | Eyebrow labels |
| `--border` | `#E8E3DC` | Card borders, dividers |
| `--dark` | `#141414` | Partner section background |

**Typography:**
- Font: `Inter`, weights 400 / 500 / 600. No italic. Fallback stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
- Headings: medium (500), tight letter-spacing (-0.9 to -1.6px), line-height 1.08–1.2.
- Body: 15–16px / 1.55–1.65 line-height.
- Eyebrow labels: 11px, uppercase, letter-spaced ~2px, muted color.

**Spacing scale:** 4 / 6 / 8 / 10 / 14 / 18 / 22 / 32 / 40 / 56 / 72 / 88 / 96 px. Sections are 96px top/bottom on desktop, 72px on tablet, 56px on mobile. Container max-width 1120px, horizontal padding 32px (20px on mobile).

**Logo:** Orange scissor-K mark (`klipa_logo.png`). The mockup uses an inline SVG approximation — replace it with the transparent-background PNG once available. Keep the wordmark in lowercase: `klipa`.

---

## 4. Page Structure

Eleven blocks, top to bottom. Every block exists in `klipa_landing_mockup.html` — reference it for exact markup, copy, and spacing.

1. **Nav (sticky, cream bg)** — Logo mark + `klipa` wordmark left. "For retailers" link + orange "Join waitlist" button right. Wordmark links to `#top`, button scrolls to the second CTA section (`#waitlist`).
2. **Hero (cream, centered)** — H1 with `Klip` in orange, 2-line subcopy, inline email waitlist form (Tally), supporting line: "We'll let you know when we're ready. Move up the list by sharing."
3. **Coverage strip (warm grey surface)** — Eyebrow "COVERING" + single inline list of retailers: Meijer · Family Fare · Ken's Fruit Market · Horrocks Farm Market · Kingma's Market · Big Top Market · *and more every week*. Note: do NOT list Aldi (ToS-excluded — see `klipa_context.md` §24).
4. **How Klipa works (white)** — 3-column step grid. Large orange numerals (1, 2, 3), step H3, one-line body. Use the brand vocab: step 3 headline is *"Klip deals. Watch your Klipings add up."*
5. **Deal card teaser (surface)** — Section head: *"A deal card that tells you if it's actually a good deal."* (Orange "actually".) Single fake Family Fare card: Boneless chicken breast, **$1.99**, range `$3.20–$3.80`, pill `~45% off`, last deal `$2.49 · 3 wks ago`, orange `Klip →`. Below card: three arrow callouts explaining what each part means.
   - **Dynamic date:** The `Valid <date range>` text in the card must auto-update to the current Sunday–Saturday week. Use the script already in the mockup (targets `[data-klipa-valid-date]`, handles cross-month).
6. **Why Klipa is different (white)** — 3-column grid. Orange eyebrow titles: *Regional price context · Deal memory · Every store, side by side.*
7. **Vocab primer (cream)** — Centered card, orange-tint border. 2x2 grid of the five brand terms (Klip/Klipd/Klipings/Kliping — Klips omitted from the card but used elsewhere). Closing note: *"You'll pick them up fast."*
8. **Second CTA — orange block** — H2 *"Klipa's coming."*, subcopy, second waitlist form (Tally), referral nudge, socials line: `@getklipa on Instagram · TikTok · X`.
9. **FAQ (white)** — Four Q&A items, no accordion. Just bolded question and paragraph answer. (When does it launch / What stores / iOS only? / What does it cost?)
10. **Partner section (dark)** — Orange eyebrow "FOR RETAILERS", H2 *"For West Michigan grocers."*, lead paragraph, four bullets with vertical orange bars (Real-time analytics · Preferred partner placement · Market intelligence · 90-day free trial). CTA button *"Request a partner one-pager →"* opens the partner Tally form.
11. **Footer (cream)** — Three columns: brand block ("A product of Boudreau Ventures LLC" + "Grand Rapids, MI") · Product (waitlist / retailers / `jake@getklipa.com`) · Social (@getklipa on IG / TikTok / X). Bottom row: © 2026 Boudreau Ventures LLC + Privacy / Terms.

---

## 5. Copy — Verbatim

Use the copy from `klipa_landing_mockup.html` as-written. The mockup reflects decisions made in the design session — do not paraphrase. If you need to edit copy, flag it and request approval rather than changing silently.

**Specific copy locks:**
- Hero H1: `Klip the best grocery deals in West Michigan.` (Orange *Klip*.)
- Hero sub: `One app. Every circular. Your list, matched to this week's best deals — before you walk in the store.`
- Hero form note: `We'll let you know when we're ready. Move up the list by sharing.`
- Coverage: lists 6 retailers + italic `and more every week`. Aldi excluded.
- Second CTA H2: `Klipa's coming.`
- Partner H2: `For West Michigan grocers.` Lead: `Your circulars are already in our app. Your deals are already reaching shoppers. Want to see how they're performing?`

---

## 6. Interactions

**Sticky nav:** translucent cream background, subtle bottom border. No shadow.

**Scroll reveal (already in mockup):**
- Blocks fade up ~24px over 0.7s via IntersectionObserver when ~12% in-view.
- Grouped siblings (steps, pillars, FAQ items, partner bullets) stagger 90ms apart, capped at ~270ms.
- Hero is intentionally excluded — it's above the fold and should not animate in.
- Respects `prefers-reduced-motion` with a softer fallback (fade-only, no rise).
- Keep this script as-is. Do not replace it with a CSS-only `animation-delay` approach — reveal must trigger on scroll, not on load.

**Smooth scroll:** `html { scroll-behavior: smooth; }` for in-page anchor links.

**CTA button states:** background darkens on hover, subtle `scale(0.98)` on active.

**No modals, no carousels, no accordions.** Resist the urge.

---

## 7. Forms (Tally)

Two consumer waitlist forms + one partner form.

**Waitlist forms (hero + second CTA):**
- Should both submit to the **same Tally form ID** so all signups land in one place.
- Fields: email (required). Any additional fields (name, zip) are optional and should be collected on the Tally thank-you flow, not inline.
- Integration approach — simpler is better. Either:
  - (a) Replace the `<form>` element with a Tally iframe embed using their recommended snippet; style the iframe container to match the existing pill shape.
  - (b) Use Tally's form-submission API: keep the existing inline markup, POST to Tally on submit, show an inline success state.
  - Prefer **(a)** for speed to ship — less code to maintain.
- After successful submission: replace the form with a small confirmation line: *"You're on the list. We'll be in touch."* Keep the referral-share mechanic visible (F19 — see §10).

**Partner form:**
- CTA button `Request a partner one-pager →` opens a Tally popup or routes to a separate Tally page. Collect: contact name, store name, role, email, phone (optional).
- On submission, email notification goes to `jake@getklipa.com`.

**Placeholder markers in the mockup:** every form block is wrapped in an HTML comment starting with `<!-- TALLY: ... -->`. Swap those for the production embed.

---

## 8. Responsive Breakpoints

Already configured in the mockup. Summarized:

| Breakpoint | Target | Key changes |
|---|---|---|
| `< 900px` | tablet | Steps/pillars collapse to 1 column (centered, max 560px). Vocab grid stacks. Section padding drops to 72px. Hero h1 44px, section h2 30px. Footer grid becomes 2-column; brand col spans full width. |
| `< 560px` | mobile | Container padding 20px. Hero 34px. Waitlist form stacks vertically; button becomes full-width. Section padding 56px. FAQ tightens. Footer collapses to single column. |

Test at 375px (iPhone SE), 768px (iPad portrait), 1024px, 1280px, 1440px.

---

## 9. Accessibility

- Every `<button>` and link has visible hover/focus states.
- Every image/icon that conveys meaning has an `aria-label` or `alt`. Decorative SVGs use `aria-hidden="true"`.
- Form inputs have `aria-label` (email input) with the visible placeholder as a non-primary hint.
- Screen-reader-only helper class `.sr-only` is defined — use it when visual labels are omitted.
- Color contrast: all text meets WCAG AA on its background. Orange-on-white body copy is avoided; orange is used only for headings, pills, and CTAs.
- Page is keyboard navigable; focus order follows DOM order. No focus traps.

---

## 10. Deployment Checklist

**Pre-push:**
- [ ] Replace placeholder SVG logo mark with transparent-bg `klipa_logo.png` (both nav and footer).
- [ ] Replace both Tally placeholders with production embed.
- [ ] Replace partner-form `alert()` with Tally popup or page link.
- [ ] Set `<title>` to `Klipa — Klip the best grocery deals in West Michigan` and confirm `<meta name="description">`.
- [ ] Add Open Graph + Twitter card meta: title, description, image (generate a 1200×630 share card with logo + hero H1).
- [ ] Add favicon.
- [ ] Add `robots.txt` (allow all) and `sitemap.xml` (one URL).

**Vercel:**
- [ ] Connect the GitHub repo to Vercel (F3/F4 already complete).
- [ ] Confirm preview deploys green on every PR.
- [ ] Custom domain stays **unattached to DNS** until trademark is filed (F2). Once filed, point `getklipa.com` A/CNAME records in Cloudflare (DNS-only mode) to Vercel.

**Waitlist referral mechanics (F19 — this page unlocks it):**
- After build ships, wire Tally's referral/UTM fields so shared links credit the referrer. Final mechanic TBD — not required at first deploy. See `klipa_execution_plan.md` F19.

**Do NOT:**
- Add tracking pixels, GA4, Facebook Pixel, or any cookie-setting analytics without a privacy policy + cookie banner.
- Add App Store links. There is no app yet.
- List Aldi in the coverage strip. ToS-excluded.
- Mention a launch date. "Coming soon" framing only.
- Mention the founder anywhere on the page.

---

## 11. Out of Scope (intentionally)

- Blog / news section.
- App screenshots (static fake deal card is the only product visual).
- Competitor comparison (skipped entirely).
- Testimonials (none exist yet — don't fabricate).
- Multi-language (English only).
- Dark mode toggle.

---

## 12. Cursor Working Instructions

When handing this to Cursor:

1. Start from `klipa_landing_mockup.html` as the seed file — it's already complete.
2. Ask Cursor to split the inline `<style>` and `<script>` into `/styles/main.css` and `/scripts/main.js` respectively. Preserve all behavior.
3. Ask Cursor to swap the SVG logo placeholders for `<img src="/assets/klipa_logo.png" alt="Klipa" />` once the transparent PNG is on hand.
4. Ask Cursor to replace the two TALLY-marked `<form>` blocks with the production Tally embed snippet (same form ID for both).
5. Ask Cursor to replace the partner-form `onclick="alert(...)"` with the production Tally popup or link.
6. Run one responsive pass at 375 / 768 / 1120 / 1440.
7. Commit, push, verify Vercel preview, then merge to `main`.

**Prompt template for Cursor (starting point):**

> I'm building the Klipa landing page. The file `klipa_landing_mockup.html` is a complete reference implementation. Please scaffold a production repo with `index.html`, `/styles/main.css`, `/scripts/main.js`, `/assets/` (include placeholder favicon and swap the inline SVG logo for `klipa_logo.png` when present), plus `robots.txt` and `sitemap.xml`. Preserve every section, all copy, all interactions (scroll reveal, smooth scroll, dynamic week date on the deal card). Do not change any copy. Split styles and scripts into external files. Confirm the site works identically to the mockup at 375 / 768 / 1120 / 1440.

---

*End of brief. For product, brand, or ToS questions, consult `klipa_context.md` (source of truth). For task sequencing, consult `klipa_execution_plan.md`.*
