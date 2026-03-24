# Minimal Black & White Site

Files created:

- `index.html`
- `styles.css`
- `script.js`

How it works

- Top banner contains a white rectangular logo (SVG) with black text and the menu below it.
- Clicking `Menu1`, `Menu 2`, or `Menu 4` switches the visible content section.
- Elements with the class `fade` are observed with an `IntersectionObserver` and gain the `visible` class when they enter the viewport; when out of view they fade out.

Theme suggestions

- Primary palette: black background `#0b0b0b` and white foreground `#ffffff`.
- Muted text: `#aaaaaa`.
- Accent suggestions (pick one):
  - Warm accent: `#d64545` (deep coral)
  - Cool accent: `#2aa198` (muted teal)
  - Gold accent: `#c59b45` (warm gold)

Usage

1. Open `index.html` in a browser.
2. Click menu items to switch sections; scroll to see items fade in/out.

Notes

- Images are loaded from Unsplash (remote). Replace with local images if you need offline use.
- To invert (light theme), swap `--bg` and `--fg` variables in `styles.css` and adjust border/opacity as needed.
