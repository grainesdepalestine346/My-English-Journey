# Speaking correction: external services (NOT active)
GitHub Pages cannot transcribe or correct speech. Required: a speech-to-text service, an AI API, and a proxy (e.g. a Cloudflare Worker).
Flow: browser → proxy (holds secret keys) → speech-to-text → AI API → JSON back to the browser.
1. Deploy the proxy; store API keys as proxy secrets. NEVER put keys in front-end files.
2. Set `API_ENDPOINT` in `assets/js/config.js`.
3. The browser POSTs multipart form data (`audio`, `unit`, `prompt`). The page currently shows the raw JSON returned; a proper feedback layout needs the final response format.
4. Restrict the proxy to your site's origin, add rate limits, and obtain consent (GDPR) before sending student voice recordings to third parties.
Until configured, "Submit for correction" says correction is not configured and sends nothing.
