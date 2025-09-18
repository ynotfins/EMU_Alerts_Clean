# Setup & Environment

## Prereqs

- Node 18+
- Firebase CLI
- Expo CLI (via npx)
- A Firebase project with Firestore, Auth, Storage enabled
- Google Maps API key (Geocoding + Maps SDK)

## Local .env (root)
```env
EXPO_PUBLIC_APP_NAME=EMU Alerts
EXPO_PUBLIC_APP_SLUG=emu-alerts
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=...

EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_FIREBASE_PROJECT_NUMBER=...
```

Restart dev server with `--clear` after changes: `npm run start -- --clear`.

## Expo & EAS

**Login**: `npx expo login`

**Link project**: ensure `extra.eas.projectId` matches your Expo project.

**Dev**: `npm run start` → scan QR / w / a / i.

## Firebase Native Files (managed)

Place credentials (not checked in):

- `credentials/google-services.json`
- `credentials/GoogleService-Info.plist`

## Functions Secrets
```bash
firebase functions:config:set sign.api_key="..." sign.client_id="..."
# optional senders
firebase functions:config:set twilio.sid="..." twilio.token="..." twilio.from="+1..."
firebase functions:config:set sendgrid.key="..."
```

## Deploy Functions
```bash
firebase deploy --only functions
```
