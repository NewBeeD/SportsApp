# Copilot instructions for SportsApp

## Big picture
- Vite + React 18 (JavaScript) UI with MUI (`@mui/*`). Global UI/data state is Redux Toolkit slices in `src/features/**` wired in `src/app/rootReducer.js` + `src/app/store.js`.
- Strapi v4 is the main CMS/API, usually hard-coded as `https://strapi-dominica-sport.onrender.com/api/*`.
- Firebase is used for Auth + Firestore + Analytics on the client, and Cloud Functions for Prediction Game scoring.

## Key entrypoints / flow
- Bootstrap: `src/main.jsx` wires React Router + React Query defaults + Redux `Provider`.
- Routes: `src/App.jsx` uses `React.lazy()` code-splitting and logs `page_view` to Firebase Analytics.

## Data fetching conventions (important)
- Pattern A (common): “fetcher” functions call `useQuery(...)` (axios + `qs`), then **dispatch** `populate(...)` into Redux; they’re invoked like hooks: `GetFixtures()` in `src/components/homePage/Fixtures.jsx`.
  - Because they call hooks, keep invocation unconditional (no `if`/loops).
- Pattern B (also common): pages fetch directly in `useEffect` with axios + `qs` and restructure via helper modules (example: `src/pages/Article.jsx`).
- Strapi params are built with `qs.stringify(...)` (sometimes `{ encode: false }`); you’ll also see `encodeValuesOnly: true` in some Strapi v4 queries.

## Firebase conventions
- Client Firebase is centralized in `src/config/firebaseConfig.js`; prefer importing `db`, `auth`, `analytics` and Firestore helpers from there for consistency.
- Admin gating uses custom claims: the UI checks `user.getIdTokenResult(true).claims.admin` (see `src/components/homePage/NavBar.jsx`, `src/GamePrediction/pages/AdminMatchManagementPage.jsx`).
- Firestore security rules live in `firestore.rules` (notably `matches` writes require `request.auth.token.admin == true`).

## Prediction Game architecture
- UI lives under `src/GamePrediction/`.
- Data access is mostly via `src/GamePrediction/services/*.js` + hooks in `src/GamePrediction/hooks/*.jsx` (polling + Firestore reads).
- Firestore model (used by Functions/UI): `matches`, `predictions`, `leaderboard/{userId}`, plus `leaderboard/{userId}/gameweekStats/gw{n}`.
- Scoring runs server-side when `matches/{matchId}` transitions to `status === "FINISHED"` in `functions/index.js`.
  - `functions/calculatePredictionPoints.js` looks like an older variant and isn’t the deployed entrypoint.
- Admin claim utility: `setAdminClaim.js` sets `{ admin: true }` using a local `serviceAccountKey.json` (keep it out of git).

## Styling / theme
- Colors are centralized in `src/css/theme.js` and widely referenced as `appTheme.colors.*`.
- Most UI styling is via MUI `sx` props, plus CSS files under `src/css/**` and component-specific styles.

## Video integration
- `src/components/Video.jsx` supports both YouTube and Mux.
  - YouTube is detected via 11-char ID regex; otherwise it’s treated as a Mux playback ID.
  - See `MUX_INTEGRATION_GUIDE.md` for expectations.

## Dev workflows
- Frontend: `npm run dev`, `npm run build` (outputs `dist/`), `npm run preview`, `npm run lint`.
- PWA: configured in `vite.config.js` (`vite-plugin-pwa`); generate icons via `npm run generate-pwa-assets`.
- Firebase: hosting uses `dist/` (see `firebase.json`). Functions are in `functions/` (Node 20): `npm --prefix functions run serve`.

## Repo-specific gotchas
- Env vars exist in `.env` (e.g. `REACT_APP_STRAPI_URL`, Mux tokens), but the codebase currently hard-codes Strapi URLs and does not reference `import.meta.env`.
  - Before introducing env-based config, verify usage and prefer Vite-style `VITE_*` variables.
- Root project is ESM (`"type": "module"`); Firebase Functions code is CommonJS (`require(...)`). Keep that boundary consistent.
- `package.json` contains a `gh-pages` deploy script that targets `build/`, but Vite builds to `dist/` (may be stale vs Firebase Hosting config).
