# Miyabi Tamura — Portfolio

A single-page portfolio for **Miyabi Tamura**, Senior Full-Stack & AI Engineer.

Static site — no build step. Plain HTML, CSS, and vanilla JavaScript.

## Structure

```
index.html        # all sections (hero, about, services, skills, work, experience, contact)
css/styles.css    # design system + components (dark/light themes)
js/main.js        # interactions, scroll reveals, counters, filtering, contact form
favicon.svg
```

## Run locally

Open `index.html` directly in a browser, or serve the folder:

```bash
npx serve .
```

## Deploy (Vercel)

This repo is wired for Vercel's Git integration — every push to `main` triggers a deploy.
No framework/build configuration is required; Vercel serves the static files as-is.
