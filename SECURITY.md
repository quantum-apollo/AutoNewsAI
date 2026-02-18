# Security checklist and proxy deployment

This project now uses safer defaults. Follow the steps below to finish a secure production setup.

## 1) Move secrets to EAS (done)
- Store API keys as EAS secrets (you can verify via `eas secret:list`):
  - NEWS_API_KEY
  - RAPIDAPI_KEY

## 2) Deploy a small serverless proxy (recommended)
- Deploy the `api/rapid/*` functions to Vercel / Netlify (these files are included in the repo).
- Set `RAPIDAPI_KEY` as an environment variable in that hosting platform.
- Example (Vercel): `vercel --prod` from the repo root (configure env vars in the Vercel dashboard).

## 3) Configure the mobile app to use the proxy
- Set `RAPID_PROXY_URL` as an EAS env variable (or in `expo.extra` for local testing):
  - `eas env:create --name RAPID_PROXY_URL --value https://your-proxy.example.com` (or add to app.json extras for dev only)
- The mobile client will prefer proxy requests when `RAPID_PROXY_URL` is set (no secret in binary).

## 4) Remove local keys (done)
- `.env` has been sanitized. Do not re-add production keys to the repository.

## 5) WebView & UI hardening (done)
- Map WebView `originWhitelist` restricted and CSP added to `assets/maplibre.html`.
- `SafeAreaProvider` added to app root so system status (battery/time) remains visible.

## 6) Optional improvements
- Add authentication + rate limiting on the proxy to prevent abuse.
- Use server-side caching for frequent NewsAPI/RapidAPI calls to reduce cost and latency.

If you want, I can deploy the `api/rapid` proxy to Vercel for you and set `RAPID_PROXY_URL` as an EAS env value.