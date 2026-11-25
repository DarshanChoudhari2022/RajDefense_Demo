# Raj Defence & Aerospace launch checklist

Updated 24 November 2026.

## Implemented

- The site is Vite + React. Sections are components in `src/components/`, page shells in `src/pages/`, and the scroll, 3D and form behaviour in `src/scripts/` (loaded after first render). Static files (images, PDF, `robots.txt`, `sitemap.xml`) live in `public/`. `npm run build` writes `dist/`. Canonical and social tags are in `index.html`. Pages: `/` and `/privacy`, with a 404 fallback.
- The enquiry form posts JSON to `api/enquiry.js`, which validates fields, checks a honeypot, rate limits and forwards to Web3Forms. The page shows a thank-you state only on success. The form's interest list must stay in sync with the `interests` set in `api/enquiry.js`.
- No analytics are loaded, so there is no cookie banner. The old Google Analytics setup was removed with the previous site; the Privacy page says so. Re-add consent handling if analytics return.
- Hero and section video or image slots are not wired yet. See `docs/MEDIA-BRIEF.md`.

## Account setup and live checks

1. Configure `WEB3FORMS_ACCESS_KEY` on the Raj Vercel project. Confirm the paid Web3Forms plan supports server submissions and arrange the provider’s server IP allowlist. Check the provider’s domain-restriction settings for the selected plan. Use an authorised Raj test enquiry and confirm provider acceptance, the confirmation page and inbox receipt. [Web3Forms server-side requirements](https://docs.web3forms.com/getting-started/troubleshooting)
2. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for a shared rate limit if the production form will use multiple server instances. The built-in fallback limits requests per instance and resets on process restart. Configure and exercise the shared limit or a host firewall rule before relying on it for sustained abuse protection.
3. (Only if analytics return) Add the Raj GA4 web stream ID as `NEXT_PUBLIC_GA_MEASUREMENT_ID` and redeploy. Accept and check Realtime. In a fresh session, decline and confirm the browser makes no Google tag or analytics requests. In GA4, derive `enquiry_confirmation` from `page_view` for the Raj confirmation URL and mark it as a key event. This counts visits to the confirmation page, including direct visits. Confirm delivery using the Raj inbox. [GA4 key events](https://support.google.com/analytics/answer/12844695)
4. Verify the production URL in Search Console. Set `GOOGLE_SITE_VERIFICATION` to the HTML-tag token and redeploy, or verify ownership through DNS if Raj uses a custom domain it administers. Submit `https://rajdefense.vercel.app/sitemap.xml` and request homepage indexing. The current canonical origin is `https://rajdefense.vercel.app`. Update the build origin and check apex and www redirects if Raj moves to an owned domain. [Search Console verification](https://support.google.com/webmasters/answer/9008080)
5. Ask the Raj business owner to review the contact details, FAQ, privacy notice, retention practices and provider arrangements. Check LinkedIn and WhatsApp previews after their caches refresh. Obtain the approved quote, display name, attribution, permission date and any approved photo before publishing a testimonial.

## Local verification

`npm run dev` serves the site on `http://127.0.0.1:4175`, including `/api/enquiry`. `npm run build` then `npm run preview` tests the production build. Local checks exercised eight public routes, mobile navigation, the 404 response, metadata, the sitemap, the 3D aircraft viewer, server validation, throttling, provider success and failure, and analytics acceptance, decline and withdrawal. Delivery used a mock provider and Google requests were intercepted. No live enquiry or analytics event was sent.
