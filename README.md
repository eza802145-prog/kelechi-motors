# Kelechi Motors — Used Car Buying Guide Funnel

This project is the Netlify-ready customer-facing funnel with a four-section navigation:

1. Landing Page — public landing page and registration form.
2. 7 Mistakes — jumps to the seven used-car buying mistakes section.
3. Free Guide — jumps to the guide overview section.
4. Lead Sheet — public demonstration table with three masked sample records.

## Important data and privacy notes

- The public Lead Sheet contains demonstration records only. Names, email addresses, and phone numbers are masked.
- It does not expose the live Google Sheet or real customer contact information.
- New registrations continue to use the existing Google Form and Google Sheets integration configured in `guideContent.ts` and the current Apps Script workflow. Do not replace those URLs unless intentionally changing the integration.
- The former local JSON lead database from the AI Studio export is not used for this public demo table.

## Build and deploy

Netlify build command: `bun run build`
Publish directory: `dist`

The repository is configured to deploy from GitHub. Replace the repository files with this project version, commit the changes, and Netlify should start a new deploy automatically.
