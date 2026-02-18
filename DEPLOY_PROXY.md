Deployment — serverless RapidAPI proxy (api/rapid)

Overview
- The repository already includes serverless proxy endpoints under `api/rapid/*` (CNN, Reuters, classify, politics).
- Recommended host: Vercel (zero-config for `api/*` functions).

Options
1) Deploy to EAS Hosting (recommended for this repo)
   - The repo now includes Expo Router `app/api/rapid/*+api.ts` server routes. You can publish these server routes to EAS Hosting using the `eas deploy` flow.
   - Steps (quick):
     - Ensure `web.output` is set to `server` in `app.json` (already done).
     - Add your RapidAPI key to the project hosting env (expo.dev dashboard → Hosting → Environment variables) or use the Expo project settings on the CLI.
     - Export & deploy: `npx expo export --platform web` then `npx eas-cli@latest deploy --prod`.
     - After deploy, set `RAPID_PROXY_URL` (optional) to `https://<your-deploy-domain>/api/rapid` if you want an explicit proxy URL in client config; otherwise the client defaults to the same-origin `/api/rapid` path.

2) Deploy to Vercel (existing instructions)
   - Follow the Vercel steps below if you prefer Vercel; the `api/rapid` directory is still present for Vercel-style functions.
   - After deployment, set the EAS secret: `eas secret:create --name RAPID_PROXY_URL --value 'https://<your-domain>/api/rapid'`
   - (Optional) In your Expo app config set `RAPID_PROXY_URL` in `app.json`/`app.config.js` if you use static runtime config.

How to provide a Vercel token (if you want me to deploy)
- Create a Vercel token: https://vercel.com/account/tokens → "Create Token"
- Paste the token in this chat (I will use it only to run `vercel --prod` from the repository and will not store it in the repo).

Testing the proxy after deploy
- Example endpoint: `GET https://<your-domain>/api/rapid/reuters?q=ukraine&limit=10`
- Confirm it returns JSON from the RapidAPI provider; if you see a 500 error, verify `RAPIDAPI_KEY` is set in Vercel environment variables.

Notes
- The proxy keeps `RAPIDAPI_KEY` server-side; the client app calls `/api/rapid/*` without exposing the secret.
- If you prefer Netlify, the functions will work there too; ask and I’ll add `netlify.toml`.
