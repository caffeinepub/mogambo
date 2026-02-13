# Specification

## Summary
**Goal:** Build “Mogambo,” a job finder aggregator with unified search across configurable sources, an admin-only management panel, Internet Identity auth, and an AdSense-ready layout with toggleable ad slots.

**Planned changes:**
- Set the app name to “Mogambo” across user-visible UI and metadata.
- Implement unified job search UI (keyword, location, optional filters) and a normalized aggregated results list (title, company, location, source, date, apply URL) with per-source non-blocking error indicators.
- Add backend source management in canister state (id, name, base URL/endpoint, fetch type JSON/RSS, enabled), fetching from enabled sources via HTTPS where possible, and expose list/search methods returning aggregated results plus per-source errors.
- Create an Admin Panel route restricted to authenticated admin users for CRUD and enable/disable of sources, plus basic settings (ad slots enable/disable and AdSense publisher/client id).
- Implement Internet Identity sign-in/out and backend authorization enforcing admin-only mutations, including an admin allowlist mechanism (bootstrap + admin-only add/remove).
- Add AdSense-ready ad slot components (at least two placements) that render only when enabled and fail gracefully when blocked/misconfigured.
- Apply a coherent Mogambo visual theme across search/results and admin screens, avoiding blue/purple as primary colors.
- Add and wire static brand assets (logo and favicon) into the header and browser tab.

**User-visible outcome:** Users can sign in, search jobs by keyword and location to see a combined list from multiple enabled sources with clear source labeling and apply links; admins can securely manage sources and ad/settings, and the UI includes optional, toggleable ad placements with a consistent Mogambo theme and branding.
