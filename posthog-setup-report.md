<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **DevEvent** Next.js 16 App Router project.

## Summary of changes

The following files were created or modified to integrate PostHog:

- **`instrumentation-client.ts`** *(new)* — Initializes PostHog client-side using the Next.js 15.3+ `instrumentation-client` pattern. Configured with a reverse proxy (`/ingest`), exception capture (error tracking), and debug mode in development.
- **`next.config.ts`** *(updated)* — Added PostHog reverse proxy rewrites (`/ingest/static/:path*` and `/ingest/:path*`) and `skipTrailingSlashRedirect: true` to ensure reliable event delivery and bypass ad blockers.
- **`lib/posthog-server.ts`** *(new)* — Server-side PostHog Node.js singleton client for future use in API routes and Server Actions, with `flushAt: 1` and `flushInterval: 0` for immediate event flushing.
- **`.env.local`** *(updated)* — PostHog API key and host added as `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`components/ExploreBtn.tsx`** *(updated)* — Added `explore_events_clicked` capture to the "Explore Events" button click handler.
- **`components/EventCard.tsx`** *(updated)* — Added `'use client'` directive and `event_card_clicked` capture with event metadata (title, slug, location, date) on Link click.
- **`components/NavBar.tsx`** *(updated)* — Added `'use client'` directive and `nav_link_clicked` capture with link label on each navigation link.
- **`app/page.tsx`** *(updated)* — Added `'use client'` directive and `home_page_viewed` event (top-of-funnel) with featured events count on mount.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `home_page_viewed` | User viewed the home page — top of the event discovery funnel. Includes `featured_events_count`. | `app/page.tsx` |
| `explore_events_clicked` | User clicked the "Explore Events" CTA button on the hero section. | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked an event card to view details. Includes `event_title`, `event_slug`, `event_location`, `event_date`. | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicked a navigation link. Includes `link_label` (Home, Event, Create Event, Logo). | `components/NavBar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://us.posthog.com/project/322389/dashboard/1304150
- **Event Discovery Funnel** (conversion funnel: home → explore → card click): https://us.posthog.com/project/322389/insights/XNg26e33
- **Daily User Activity Trends** (all events over time): https://us.posthog.com/project/322389/insights/RfnHnTuH
- **Unique Visitors per Day** (DAU on home page): https://us.posthog.com/project/322389/insights/SYT1frLU
- **Most Clicked Events** (top events by popularity): https://us.posthog.com/project/322389/insights/5sRk1u2T
- **Nav Link Click Distribution** (pie chart of nav usage): https://us.posthog.com/project/322389/insights/X8yigClH

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
