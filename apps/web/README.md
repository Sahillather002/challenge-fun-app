
# FitBattle Health Competition Web App

This workspace contains the Vite/React web version of the FitBattle health competition app. It mirrors the mobile app experience with responsive web pages for home, health tracking, community, competitions, goals, rewards, profile, settings, and help.

## Run locally

1. Install dependencies from the monorepo root:
   ```bash
   npm install
   ```

2. Start the web app:
   ```bash
   npm run dev:web
   ```

3. Open the app at the URL shown by Vite, usually `http://localhost:3002`.

## Backend integration

The web app uses `apps/web/lib/api.ts` to call the shared health competition backend through `@health-competition/shared`. If backend endpoints are not running, pages fall back to mobile-inspired mock data so the UI remains usable during local development.
