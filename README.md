# Trovo Website — "The Food Truck Crawl"

Marketing site for **Trovo**: find food trucks that are actually open. Each section is a stop on a food truck crawl, and the route bar at the bottom shows a truck driving from stop to stop as you scroll.

Plain HTML, CSS and JavaScript, with no build step. Open `index.html` or deploy the folder to GitHub Pages, Netlify or Vercel.

## How the page works

A switch at the top ("I'm hungry / I own a truck") swaps the whole page to that visitor's story, so nobody reads the half that isn't for them. Each stop is one headline, one line of text and one thing to try.

**Foodie crawl (4 stops):** The Lot → Closed Window (old way vs Trovo switch) → Try It (live map demo, craving filters, save a truck) → Join
**Truck crawl (5 stops):** The Lot → The Posting Grind (old way vs Trovo switch) → Go Live (simulator + story card) → Founders (pricing) → Join

| Book | Where it shows up |
|------|-------------------|
| StoryBrand (Miller) | 5-second hero (what / why / one button), problem → guide → 3-step plan → call to action → success; Join button always visible in the route bar |
| Contagious (Berger) | Time-of-day trigger in the hero, "11:45 → open Trovo", shareable story cards, Founding badge, "Send to my lunch group" |
| Influence (Cialdini) | Reciprocity (free for foodies, free truck listing), commitment (save a truck), scarcity (founding cohort), authority (truck-confirmed check-ins), unity (Middle Georgia) |

**Social proof is intentionally missing.** Add real truck counts, quotes and event photos once you have them. Don't invent them.

## Built for every generation

- **Boomers / Gen X:** "Bigger text" button, "Pause motion" button, visible form labels, high-contrast text, 44px+ tap targets, plain wording.
- **Millennials / Gen Z:** one-tap sharing, story cards, quick scannable copy, emoji, mobile-first layout.
- **Gen Alpha:** game-like crawl and interactive demos; the sign-up asks under-13s to have a parent sign up.
- Visitors with Reduce Motion on in their device settings start with motion paused (they can press Play).

## Before launch

1. **Waitlist form:** set `CONFIG.WAITLIST_ENDPOINT` at the top of `script.js` (e.g. a Formspree URL). Until you do, sign-ups are **not saved**.
2. **Share link:** set `CONFIG.SITE_URL` to the live domain.
3. **Pro plan features and pricing:** the Pro bullet list and $14.99 / $19.99 prices come from the strategy brief, where they are still *proposed*. Confirm them before going live.
4. **Sample data:** the map demo trucks, menus, prices and Go Live stats are illustrative and labeled as samples. Swap in real partner trucks (with their permission) when you have them.
5. Features shown as "Still in the kitchen" (ordering/Apple Pay, virtual queue, rush gauge) are not released. Keep them labeled that way until they ship.

## Deploy on GitHub Pages

Repo → Settings → Pages → Source: `main` branch, `/ (root)`. Save.

## Brand

Trovo Orange `#E6592A`, Orange Dark `#C34A20`, Midnight `#000000`, Deep Navy `#161A23`, Elevated `#1E2330`, Slate `#3A4152`, Cool Gray `#9BA6BB`, Muted `#6B7386`, Live Green `#4CD964`, Rating Gold `#FBBF24`, Map Teal `#00695C`. Font: Outfit.
