# EMU Alerts — Emergency Management & Unified Response System

**Platform:** Expo (SDK 52, Managed), TypeScript, Expo Router, Firebase Web SDK v9, React Native Maps, Expo Notifications  
**Mobile/Web:** iOS, Android, Web

## TL;DR
- Real-time incident feed (Firestore) with merge & dedupe across `alerts` and `incidents`
- Map + RESPOND deep-linking to native navigation
- Live chat per incident
- Presence pings & supervisor map (live responders)
- Files & media: photos, PDFs, e-sign send links
- Role-based UI & Firestore rules (employee/supervisor/customer)
- Push notifications pipeline (Expo Push + stored device tokens)
- CRM layer: 1:1 **Case** per alert/incident (tasks, notes, docs, timeline)

## Repo Layout
- `app.config.ts` — Managed Expo config (reads ENV, Maps plugin, identifiers)
- `firebase.config.ts` — Firebase init (Auth + AsyncStorage persistence, Firestore, offline, Functions)
- `hooks/` — `useAuth`, `useIncidents`, `useIncident`, `usePresence`, `useChat`, `useCases`
- `app/` — Router screens: tabs, incidents, incident detail + chat, cases, favorites, chat (coming), profile, documents
- `services/` — utilities for presence, storage, timeline logging
- `types/` — domain types (CRM/Case)
- `functions/` — Cloud Functions (geocode, auto-case, notify, e-sign link + webhook)
- `docs/` — Deep docs (Architecture, Setup, Security, Runbook, etc.)

## Core Features
- **Incidents:** realtime list + detail + timeline updates; distance-to-incident; search; priority chips; favorites
- **Maps & Navigate:** Google/Apple maps deep-links; server geocoding for addresses → lat/lon
- **Chat:** per-incident chat (employee ↔ supervisor)
- **Presence:** foreground/in-route location pings; supervisor map of active responders
- **CRM Cases:** auto-created for each alert/incident; tasks, notes, docs, timeline, status states
- **Media & Docs:** image uploads to Storage; PDF library; supervisor upload; case docs
- **E-Sign:** Dropbox Sign embedded request; function returns a signing URL; track status via webhook
- **Push:** device token registration and storage; test sender script; role-targeted notifications
- **RBAC:** UI gates + Firestore rules (employees create notes/tasks/docs + scoped incident fields; supervisors manage canonical fields)

## Quick Start
```bash
npm install
npx expo login
npm run start -- --clear
# press w (web) / a (Android) / i (iOS)
```

## Dev Commands
```bash
npm run start         # Expo dev server
npm run web          # Web dev
npm run typecheck    # TypeScript
npm run test         # Jest (if configured)
npx expo-doctor      # sanity check
firebase deploy --only functions  # Functions deploy
```

## Environments
`.env` (root) — EXPO_PUBLIC_* keys (Firebase config, Google Maps, app name/slug).  
Functions secrets: `firebase functions:config:set ...` for e-sign/Twilio/SendGrid.

## Status
Stable foundation with enterprise features (see docs/ROADMAP.md for next steps).