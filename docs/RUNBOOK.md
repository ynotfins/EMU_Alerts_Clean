# Runbook

## Health Checks

- `npx expo-doctor`
- `npm run typecheck`
- Metro banner shows ENV checks loading
- Firestore listeners online vs cache banner

## Common Issues

**.env not loading**: restart with `--clear`, ensure `EXPO_PUBLIC_` keys

**Maps blank**: check Google API key + iOS/Android Maps SDK enabled

**Auth persistence warning**: ensure firebase/auth/react-native + AsyncStorage

**Push not received**: verify device token saved; use `tools/send-push.js` to test

**Functions failing**: `firebase functions:log`, confirm `functions:config:set` values

**Geocode not filling coords**: check Functions logs + Geocoding quota

## Data QA

**Create test incident**: verify appears with correct priority badge, distance, and map marker

**Respond flow**: triggers supervisor push; presence pings visible

**Chat**: messages appear across devices/roles

**E-Sign**: link generated, webhook flips status on completion