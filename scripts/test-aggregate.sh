#!/usr/bin/env bash
# Quick test helper — calls the deployed preview aggregator and shows counts.
set -euo pipefail

URL=${1:-https://dexterdexter-expo-project--sls54jeo0g.expo.app}
echo "Calling aggregator: $URL/api/aggregate/news"
curl -sS "$URL/api/aggregate/news" | jq '.' || true
