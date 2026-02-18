# AutoNewsAI 🗺️📰

A mobile-first political & economic news aggregator built with Expo + EAS. It provides:

- Map-based news discovery and politician profiles
- Server-side RapidAPI proxies (CNN / Reuters) with a silent fallback to NewsAPI
- Secure secret handling via EAS environment variables (no keys in the client)
- Web + native builds using Expo Router and EAS Hosting

Preview: https://dexterdexter-expo-project--l0e0wb3fss.expo.app

Production: https://dexterdexter-expo-project.expo.app

Release: `v1.0.0` — 2026-02-18

Changelog: initial production release — map-based discovery, NewsAPI ingestion, RapidAPI proxy with silent NewsAPI fallback, CI and EAS Hosting deployment

---

## Quick start 🚀

1. Clone

```bash
git clone https://github.com/quantum-apollo/AutoNewsAI.git
cd AutoNewsAI
```

2. Install

```bash
npm ci
```

3. Set secrets (do NOT commit `.env`)

- `NEWS_API_KEY` — NewsAPI.org server key
- `RAPIDAPI_KEY` — RapidAPI key (optional; proxies handle missing/subscription by falling back)
- Optional: `RAPID_PROXY_URL`, `RAPIDAPI_HOST_CNN`, `RAPIDAPI_HOST_REUTERS`

Store these in EAS Hosting / EAS CLI or your local `.env` for development.

4. Run (development)

```bash
npx expo start --dev-client   # native dev-client
npx expo start                # web
```

5. Deploy (preview)

```bash
npx expo export --platform web --no-ssg
npx eas-cli@latest deploy     # creates a preview on EAS Hosting
```

---

## Important server routes (server-side only) 🔧

- `GET /api/debug/env` — shows which secrets are present at runtime
- `GET /api/aggregate/news` — NewsAPI aggregator (politics / economics / global)
- `GET /api/rapid/cnn?q=<q>` — CNN proxy; add `&force_fallback=1` to force NewsAPI fallback when testing

Examples:

```bash
curl "https://<your-preview>/api/debug/env"
curl "https://<your-preview>/api/rapid/cnn?q=ukraine&force_fallback=1"
```

Behavior notes:
- RapidAPI proxies never expose provider errors to clients; any RapidAPI failure silently falls back to `NewsAPI` if available.
- Add `force_fallback=1` to test fallback paths.

---

## Development notes & security ⚠️

- Secrets must be set via EAS Hosting or the EAS CLI — they are not accessible from the client bundle.
- `.env` is ignored and was removed from the repository index.
- Console/log statements used only in `scripts/` for tests; production code is cleaned of `console.*`.

---

## Contributing & license

- Open issues or PRs against this repository.
- Licensed under MIT — see `LICENSE`.

---

If you want, I can add CI (GitHub Actions) or a short `CONTRIBUTING.md` next. 💡
