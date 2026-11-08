# Trovo Website — "The Food Truck Crawl"

Marketing site for **Trovo**: find food trucks that are actually open. Each section is a stop on a food truck crawl, and the route bar at the bottom shows a truck driving from stop to stop as you scroll.

Plain HTML, CSS and JavaScript, with no build step. Open `index.html` or deploy the folder to GitHub Pages, Netlify or Vercel.

## The stops

| # | Stop | StoryBrand (Miller) | Contagious (Berger) | Influence (Cialdini) |
|---|------|--------------------|---------------------|----------------------|
| 1 | The Lot (hero) | Character + what they want, in one line | **Trigger**: live clock, "who's serving right now?" | Liking (local, friendly) |
| 2 | The Closed Window | Villain (stale info); external, internal and philosophical problem; stakes | **Emotion**: that "it's closed" sinking feeling | Contrast (old way vs Trovo way) |
| 3 | Meet Trovo | Guide = empathy + authority | **Practical value**: live map demo | **Authority**: vendor-confirmed and auto-expiring listings |
| 4 | The Plan | Simple 3-step plan | **Triggers**: "when the clock hits 11:45" | **Commitment**: craving picker, then favorite |
| 5 | For Truck Owners | Vendor as hero, plus a second CTA | **Public + social currency**: shareable story cards | **Reciprocity**: free listing and tools |
| 6 | Founders' Window | Transitional and direct CTAs | **Social currency**: be a founding truck | **Scarcity**: founding cohort rate; **Reciprocity**: free first |
| 7 | Dessert | Success picture + direct CTA | **Social currency**: Founding Foodie or Founding Truck badge; **Public**: invite link | **Unity**: "Made in Middle Georgia"; Commitment |

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
