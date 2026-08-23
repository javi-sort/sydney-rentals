# Sydney Rentals

A rental listing tracker for Sydney (multi-city planned). Chrome extension captures listings while browsing, Express/MongoDB backend stores them, cron job monitors if they go down.

## Stack
- Backend: Node.js, Express, TypeScript, MongoDB Atlas (Mongoose)
- Chrome extension: Manifest V3, vanilla JS (popup.html, popup.js, content.js, background.js)
- Cron jobs: Playwright (planned)
- Frontend: TBD

## Project Structure
- `src/` — Express backend (index.ts, models/Listing.ts, routes/listings.ts, controllers/listingsController.ts)
- `chrome-extension/` — manifest.json, popup.html, popup.js, content.js, background.js

## Running the backend
npx ts-node src/index.ts

## Key decisions
- No scraping — extension reads DOM directly from listing pages the user is already browsing
- background.js handles fetch to backend (avoids CORS issues in content scripts)
- Target sites: realestate.com.au, domain.com.au

## MVP Features
1. Save rental listings via Chrome extension while browsing
2. Alert when a tracked listing goes down (isActive flips to false)
3. Surface agent contact info (name, phone, role)
4. Filter/sort by travel time to saved locations via Google Maps Distance Matrix API

## Planned Future Features
- Cron job (Playwright) to periodically check saved listing URLs for price changes and availability
- React Native (Expo) or web frontend for browsing saved listings, travel times, alerts
- Price history tracking (detect and store when price drops/increases)
- Multi-city support beyond Sydney
- Alerts via push notification or email when listing status changes

## Listing Model
url, suburb, price, beds, baths, isActive, agentName, agentPhone, agentRole, timestamps

## Current Status (last updated: 2026-08-23)

**What's working:** End-to-end save flow confirmed — extension → background.js → Express backend → MongoDB Atlas.

**Immediate next task:** Fix CSS selectors in `chrome-extension/content.js` to properly scrape beds, baths, suburb, and agent details from realestate.com.au listing pages.

Current selectors are placeholders that likely don't match the real DOM. The plan is to:
1. Enable Chrome browser tools in Claude Code (restart session or run `/chrome`)
2. Inspect a live listing (e.g. https://www.realestate.com.au/property-apartment-nsw-pyrmont-444690340) to find correct selectors
3. Update `getListingData()` in content.js for both realestate.com.au and domain.com.au

**Also note:** When starting a new session, if Chrome browser tools are not yet enabled, prompt user to restart Claude Code or run `/chrome` before attempting DOM inspection.
