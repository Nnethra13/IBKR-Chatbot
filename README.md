# IBKR Trading Chatbot Challenge – Landing Page

This is a small, static website to showcase a trading chatbot for a student trading competition and to share key information about the event (timeline, prizes, rules, FAQ, etc.).

It’s built with **plain HTML, CSS, and JavaScript** so you can adapt it easily to any stack or hosting platform.

## Structure

- `index.html` – Main single-page layout with:
  - Hero section highlighting the competition
  - A glassmorphism-style chatbot demo card
  - Sections for _About_, _How it works_, _Prizes_, _Rules_, and _FAQ_
- `styles.css` – Visual design (gradient background, card layout, responsive styles)
- `script.js` – Lightweight, front-end-only chatbot demo logic
- `package.json` – Minimal metadata plus a convenience `start` script

## Running locally

You can open the site directly in a browser, or use a simple static server.

### Option 1 – Open directly

1. Double-click `index.html` (or open it via your browser’s “Open File…” menu).
2. Everything runs client-side; no backend is required for the demo.

### Option 2 – Simple local server (recommended)

From the project root:

```bash
npm install -g serve       # if you don’t already have `serve` installed
serve .
```

Then open the printed `http://localhost:PORT` URL.

## Customizing for your competition

- **Branding**: Update the title, colors, and logo text in `index.html` / `styles.css`.
- **Competition details**: Replace placeholder dates, prizes, and eligibility notes with your actual information.
- **Registration link**: In the `Prizes & recognition` section, swap the `href="#"` with your real form or portal URL.
- **Chatbot behavior**:
  - For now, the chatbot is a front-end-only demo with canned replies.
  - To integrate a real model or backend, connect `script.js` to your API and handle requests/responses there.

## Notes

- The current design is optimized for **desktop and mobile** with a responsive layout.
- Feel free to embed this page into a bigger site or port the styles/components into a React, Next.js, or other framework-based app.

