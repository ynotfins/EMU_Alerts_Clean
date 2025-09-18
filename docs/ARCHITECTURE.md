# Architecture

## Stack & Rationale

**Expo Managed (SDK 54)**: rapid mobile/web parity without native folders

**Firebase (Web SDK v9 modular)**: Auth, Firestore (realtime + offline), Storage, Functions

**Expo Router**: file-based routing; typed routes

**React Native Maps**: consistent map UX

**Expo Notifications**: local + server-triggered push

## Data Model (Firestore)

### Incidents & Alerts

Two sources: `alerts/` and `incidents/`. Client merges + dedupes by `alertId`.
Key fields: `timestamp`, `alertType`, `state/county/city`, `address`, `message`, `status`, `priority`, `coordinates?`, `hasMedia?`.

### CRM: Cases

`cases/{id}` is 1:1 with alert/incident (id-matched).
Fields: `alertRef { source, id }`, `status`, `priority`, `assignedTo?`, `homeowner?`, `timestamps`.
Subcollections:

- `notes/` (employee/supervisor write)
- `tasks/` (employee/supervisor create/update)
- `docs/` (uploaded PDFs/e-sign tracking)
- `timeline/` (system & user events: respond/arrive/complete, chat, media, status)

### Users

`users/{uid}` user profile + role (employee|supervisor|customer), `pushTokens/`, `presence/now`.

## Functions

**Geocode**: Fill coordinates from address via Google Geocoding when missing.

**Auto-Case**: Ensure a `cases/{id}` exists for any upsert to `alerts/` or `incidents/`.

**Notify on Respond**: Push to all supervisors when a `responses` doc is created with `status='responding'`.

**E-Sign**: Callable creates embedded request (Dropbox Sign), returns `sign_url`, logs tracking doc. Webhook marks completed.

## Presence & Supervisor Map

Foreground and "responding" interval pings → `users/{uid}/presence/now` writes `{ lat, lng }`.

Supervisor screen aggregates presence via `collectionGroup` query.

## RBAC Strategy

**UI Gate**: RoleGate component controls visibility and actions.

**Rules**: Employees can create notes/tasks/docs and update scoped `employeeInputs` on incidents. Supervisors own canonical homeowner data and case status/assignments.

## Navigation & Distance

Client calculates distance via Haversine when coordinates exist (guaranteed by geocode function).

Deep-links to Apple/Google Maps for turn-by-turn navigation.

## Push

On sign-in, device push token is stored under `users/{uid}/pushTokens`.

Server uses Expo Push API to target roles or specific users.

## Error Handling & Offline

Firestore listeners tolerate offline; UI shows "From cache" banner.

Uploads and writes have explicit user feedback (toasts/alerts).
