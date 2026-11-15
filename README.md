# CMusicStudio: prototype

One-page site for a rehearsal and recording studio in Senegal: highlights, an availability calendar and a
reservation form with Senegal payment choices. French by default, English through the EN/FR button.
See `BRIEF.md` for the full requirements.

## Run it
Open `index.html` in a browser, or serve the folder: `python -m http.server 8081` then http://localhost:8081.
No build step and no dependencies.

## Files
- `index.html`, `styles.css`: the page.
- `app.js`: settings (`CONFIG`: rates, opening hours, deposit share), French/English texts, calendar, slots, form.

## What is a stand-in (to replace when migrating)
- **Bookings** are kept in `localStorage` (`cms.bookings`), and a few hours per day look "taken" from demo data (`demoTaken`). Real version: a server with a database that refuses a slot taken in the meantime.
- **Email to the owner** is only shown on screen (`STUB 2` in `app.js`). Real version: AWS SES (and optionally WhatsApp) with Confirm / Refuse links; the payment link is created when the owner confirms.
- **Payments** (Wave, Orange Money, card, on site) are choices only, with a 30 % deposit shown. No provider is wired yet.
- **Photos, texts, rates, address and phone numbers** are placeholders.

## Decisions to confirm
Rates and opening hours, deposit share, single room or two (rehearsal and recording currently have separate availability), payment providers.
