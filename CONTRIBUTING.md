# Contributing to AutoNewsAI

Thanks for helping improve AutoNewsAI — your contributions are welcome. Please follow these simple guidelines to get started.

- Fork the repository and create a branch named `feat/<short-desc>` or `fix/<short-desc>`.
- Keep changes focused and add tests where useful.
- Run the existing checks locally before submitting:
  - `npm ci`
  - `npm run lint`
  - `npx tsc --noEmit`
  - `npx expo export --platform web --no-ssg` (optional smoke test)
- Open a Pull Request and describe the change and motivation.

Maintainers will review the PR; continuous integration runs on each push/PR to `main`.

Notes on secrets
- Do NOT commit `.env` or any keys. Use EAS environment variables or GitHub Secrets for CI/deploy.

Thank you — looking forward to your PRs!