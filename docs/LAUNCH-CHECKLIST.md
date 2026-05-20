# The Design Hutch Launch Checklist

Use this before the site goes live.

## Must Do Before Live

### 1. Form Delivery

- Confirm the Formspree endpoint in `content/site.ts`.
- Submit a test enquiry from the live deployment.
- Confirm the Formspree notification arrives.
- Confirm the Formspree project forwards enquiries to the right inbox.

### 2. Calendly

- Create the real free consultation event type.
- Confirm availability, timezone, buffers, reminders, and intake questions.
- Replace or verify the URL in `content/site.ts`.
- Test both booking paths:
  - Embedded calendar in the contact section.
  - External Calendly link from mobile sticky CTA and contact section.
- Test on mobile Safari and Chrome.

### 3. Domain And Deployment

- Deploy the app to Cloudflare Pages.
- Use `npm run build` as the build command.
- Use `out` as the output directory.
- Connect `www.thedesignhutch.com`.
- Redirect other domain variations to `www.thedesignhutch.com`.
- Confirm `siteConfig.url` in `lib/constants.ts` matches the canonical live domain.
- Confirm `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, and `/icon.svg` load on production.

### 4. Analytics And Conversions

- Add `NEXT_PUBLIC_GA_ID` if using Google Analytics.
- Confirm events appear in analytics or `window.dataLayer`:
  - `cta_click`
  - `contact_form_submit`
  - `contact_form_success`
  - `contact_form_error`
  - `funnel_depth_reached`
  - `funnel_section_view`
- Mark conversions for:
  - Contact form success.
  - Calendly click.
  - Email click.
- Check analytics consent requirements before enabling tracking.

### 5. Legal And Basic Trust

- Review the lightweight privacy policy at `/privacy` before launch.
- Add a cookie notice if analytics or embedded third-party tools require it.
- Confirm South Manchester and Cheshire service-area wording is accurate.
- Confirm contact email and Calendly details are correct everywhere.

### 6. Final Content And Assets

- Review all copy for tone: clear, practical, premium, not pushy.
- Replace portfolio mockups with real screenshots when ready.
- Confirm the final logo appears correctly in:
  - Navbar.
  - Hero.
  - Footer.
  - Favicon/app icon.
  - Open Graph preview.
- Preview social sharing cards using LinkedIn, X/Twitter, and Facebook tools.

### 7. Final QA

Run locally before deploying:

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e:visual
npm run test:e2e:a11y
```

Then run on production:

- Submit a real test enquiry.
- Book a test Calendly slot.
- Click every CTA.
- Check mobile layout on an actual phone.
- Run Lighthouse on the production URL.
- Submit the sitemap in Google Search Console.

## Good To Do Soon After Launch

- Set up Google Search Console.
- Set up Bing Webmaster Tools.
- Add real case studies as soon as projects are available.
- Add testimonials once available.
- Add a pricing guide or "starting from" section if enquiry quality needs improving.
- Add local SEO landing pages for target services and areas.
- Add a blog or resource section only once core lead generation is working.
