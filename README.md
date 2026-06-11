# Shine Dental — Homepage (v3 · Noir & Brass)

Dark, editorial landing page for Shine Dental (Richmond, VA).

## Files
- `index.html` — the page (editorial split hero by default)
- `index-full.html` — same page, full-bleed image hero by default
- `styles-v3.css` — styles
- `app-v3.js` — interactions (sticky nav, scroll reveals, today's-hours highlight, inline logo) + the Tweaks panel
- `assoc-logos.js` — inlined association logos (ADA / VDA / SSDS)
- `assets/` — photography, brand logo (`shine-logo.svg`) and brand icon (`shine-icon.svg`)

Fonts (Ovo + Mulish) load from Google Fonts and the location map is a Google Maps embed — both need an internet connection.

## Preview with GitHub Pages
1. Push all files to a repo, keeping the folder structure (`assets/` must stay beside `index.html`).
2. Repo **Settings → Pages → Build and deployment → Deploy from a branch**, pick your branch and the **/ (root)** folder, Save.
3. Live at `https://<username>.github.io/<repo>/` within a minute or two.

`index.html` loads automatically at the root URL.

## Notes
- The hero has two variants (editorial split / full-bleed image) toggled in the in-page Tweaks panel; the page defaults to the editorial split.
- Some content is placeholder pending client confirmation (new-patient offer amounts, comfort amenities, the hero rating badge).
