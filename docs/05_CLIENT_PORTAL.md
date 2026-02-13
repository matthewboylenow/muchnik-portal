# Client Portal — Feature Specifications

## Overview

The client portal is Kirill Muchnik's view into his SEO performance. It must be immediately understandable without any SEO expertise. Think: "Is the phone going to ring more?" Every metric should connect to business outcomes, not technical SEO jargon. Only users with `role: client` can access routes under `/(portal)/`.

## Design Principles (Portal-Specific)

- **Simplify ruthlessly.** If Kirill has to Google what a metric means, it shouldn't be here.
- **Lead with outcomes.** Consultation requests, phone calls, and visibility — not crawl budgets and schema markup.
- **Celebrate wins.** When rankings improve or reviews increase, make it visually prominent.
- **Location-first navigation.** Kirill thinks in terms of his offices, not SEO concepts.
- **Monthly narrative.** The auto-generated summary is the most important feature. Plain English.

## Layout

Top navigation bar only (no sidebar):
- Logo: "Muchnik Elder Law" (his branding, not the SEO platform brand)
- Nav items: Overview, Locations, Content, Reviews
- Right side: Kirill's name + avatar, settings, logout
- Below nav: subtle location color strip showing all 3 locations as clickable pills

## Page: Overview (`/portal/overview`)

This is Kirill's home page. Everything he needs in one scroll.

### Hero Section — Monthly Summary

Large glass card at the top with the auto-generated plain-English summary:

> **February 2026 Summary**
> 
> "Your online visibility improved across all three offices this month. The Manhattan office saw 34% more people finding you through Google Search, and your new blog on Medicaid planning is now appearing on the first page of results. Staten Island had 12 phone calls through Google this month, up from 8 last month. Morris County received two new 5-star reviews. Here's what we're focusing on next month..."

- Generated from the `monthlySummaries` table
- Formatted with key numbers bolded
- "View Full Report" link if a PDF report is available

### Location Performance Cards (3 cards, horizontal)

One per location, using location-colored glass cards:

**Each card shows:**
- Location name + address (small)
- **Visibility Score:** Simple 0-100 number with radial progress (replaces "SEO health" — more intuitive label)
- **People Finding You:** Total impressions/searches this month + change vs last month
- **Actions Taken:** Phone calls + direction requests + website clicks combined
- **Google Rating:** Star rating display + total review count

These are the only 4 metrics. No keyword positions, no CTR, no technical metrics.

### Trend Chart — "Your Growth"

Single area chart showing combined organic visibility across all 3 locations over the past 6 months. Should go up and to the right (and it will, because the SEO work is building). 

- Simple, clean, one color (or 3 location colors stacked)
- Y-axis label: "People Finding You Online"
- X-axis: Months
- Hover: shows exact number per location

### Bottom Section — Recent Wins

A visually appealing section highlighting recent positive developments:
- "📈 Your Manhattan office now appears on page 1 for 'estate planning attorney nyc'"
- "⭐ New 5-star review in Morris County: 'Kirill was incredibly thorough...'"
- "📹 Your video on Medicaid planning has been viewed 340 times"

Use card-style list items with subtle celebratory accents (not over the top — professional).

---

## Page: Locations (`/portal/locations`)

### Three-Column Location View

Side-by-side comparison of all 3 offices. Each column is a glass card:

**Per Location:**

**"How People Find You"**
- Pie chart or simple breakdown: Direct searches (searched your name) vs. Discovery searches (searched for a service)
- This helps Kirill understand brand recognition vs. new client acquisition

**"What People Do"**
- Simple horizontal bar chart:
  - Called your office: [number]
  - Got directions: [number]
  - Visited your website: [number]
- Period comparison: "vs. last month" with arrows

**"Your Top Search Terms"**
- List of top 5 queries people used to find this location on Google
- Shown as simple text with a "people searched for this X times" count
- NO rank position numbers — instead: "✅ Page 1" or "📍 In Map Results" badges

**"Nearby Competitors"**
- Simple list: competitor name + "You rank higher ✅" / "They rank higher — we're working on it 🎯"
- Extremely simplified — no position numbers, just relative standing

---

## Page: Content (`/portal/content`)

### "Your Content" View

Show Kirill what content has been created and how it's performing:

**Blog Posts Tab:**
- Card per blog post with:
  - Title
  - Published date
  - Location tag (Manhattan / Staten Island / Morris County)
  - "X people read this" (pageviews, simplified label)
  - "This article appears on Google page [1/2/3+]" for its target keyword
  - Link to view the actual blog post on the website

**Videos Tab:**
- Card per video with:
  - Title
  - Thumbnail (from YouTube/Bunny)
  - "Watched X times"
  - "Average watch time: X minutes"
  - Platform icons (YouTube, website)

**Upcoming Content:**
- Simple list of planned content from the content calendar
- "Coming this month:" with titles and target dates
- Helps Kirill know what to expect and prepare for (especially video recording)

---

## Page: Reviews (`/portal/reviews`)

### Review Dashboard

**Summary Row:**
- One card per location showing: star rating (large), total review count, "X new this month"
- Overall average across all locations

**Review Feed:**
- Chronological list of all reviews across all locations and platforms
- Each review shows:
  - Star rating (visual stars)
  - Reviewer name
  - Review text (full)
  - Date
  - Location tag
  - Platform badge (Google, Avvo, etc.)
  - Response status: "Responded ✅" or "Needs Response"
  - If responded, show the response text

**Review Trends:**
- Simple line chart: review count per month by location
- Average rating trend over time

**Review Request Nudge** (optional nice-to-have):
- Section that says: "Want more 5-star reviews? Here are some tips for asking satisfied clients"
- Simple, non-pushy guidance on review acquisition

---

## Client Portal Notifications

The portal can show lightweight notifications pulled from the `alerts` table where `visibleToClient = true`:

- Positive alerts: rank improvements, new reviews, content published
- Neutral alerts: monthly report available, upcoming content planned
- Never show negative technical alerts to the client (those stay in admin)

Display as a subtle notification dot on the nav bar, clicking opens a dropdown.

---

## Portal Customization Notes

- The portal should feel like Kirill's dashboard, not our agency tool
- Use "Muchnik Elder Law" branding, not the platform name
- Consider using his firm's color scheme (research from the website) as an accent alongside the location colors
- No technical jargon anywhere: "impressions" → "people who saw you", "CTR" → never show this, "position" → "page 1/2/3" or "map results"
- Every number should have context: not just "340" but "340 people visited your site from Google, up 15% from last month"

## Data Refresh

- Client portal data refreshes daily (from cron jobs)
- Show "Last updated: [date/time]" subtly in the footer
- Monthly summaries auto-generate on the 1st of each month
- No manual data entry required from Kirill — everything is automated
