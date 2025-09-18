# Cloud Functions

## Geocode (address → coordinates)

**Trigger**: `onWrite` of `alerts/{id}` or `incidents/{id}`

**Action**: if missing coordinates, call Google Geocoding; update doc

## Auto-Case

**Trigger**: `onWrite` of `alerts/{id}` or `incidents/{id}`

**Action**: ensure `cases/{id}` exists with baseline metadata

## Notify on Respond

**Trigger**: `onCreate` of `responses/{rid}` with `status='responding'`

**Action**: collect supervisor push tokens; send Expo push message

## E-Sign (Dropbox Sign)

**Callable**: `createEsignLink({ caseId, fileUrl, signer })` → embedded request → `sign_url` → write tracking doc under `cases/{id}/docs`

**Webhook**: `dropboxSignWebhook` updates doc status to `completed` or `partially-signed`

## Deploy
```bash
firebase deploy --only functions
```

## Config
```bash
functions:config:set sign.api_key="..." sign.client_id="..."
```
