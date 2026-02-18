#!/usr/bin/env bash
set -euo pipefail

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "ERROR: set VERCEL_TOKEN environment variable (export VERCEL_TOKEN=...)"
  exit 1
fi

# Deploy `api/rapid/*` and other static files to Vercel (production)
# Requires Vercel CLI and a Vercel account with access to the connected GitHub repository.
npx vercel@latest --prod --confirm --token "$VERCEL_TOKEN"

# After a successful deploy, Vercel prints the deployment URL. You can then set
# RAPID_PROXY_URL in EAS using the full URL to the deployed site (see README/DEPLOY_PROXY.md).

echo
echo "Deployment finished. Find the production URL in the vercel output above."
echo "To connect the proxy to the app, run (locally):"
echo "  eas secret:create --name RAPID_PROXY_URL --value 'https://<your-deployment-domain>/api/rapid'"
