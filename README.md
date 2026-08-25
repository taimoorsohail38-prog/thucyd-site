# Thucyd

The website for Thucyd. Building companies. Backing founders. Publishing ideas.

## Structure

Static site, no build step.

- index.html, the landing page
- labs.html, feedpulse.html
- ventures.html, callpad.html
- media.html
- styles.css, the full design system
- main.js, motion and page transitions

## Run locally

Open index.html in a browser, or serve the folder:

    npx serve .

An internet connection is needed for fonts and imagery.

## Deploy

Any static host works. Vercel or Netlify: import the repo, no build command, output directory is the root.

## Notes

Type is Instrument Serif, Instrument Sans, and IBM Plex Mono via Google Fonts. Motion runs on GSAP and Lenis. Imagery is public domain, photographs of the Parthenon, the Acropolis, a Roman-era bust of Thucydides, a tenth century manuscript of his History, the Winged Victory of Samothrace, and the Zeus of Otricoli, served from Wikimedia Commons. For production these should be self-hosted in an assets folder.

Copy on the CallPad page is placeholder pending sign-off.
