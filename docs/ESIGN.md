# E-Sign Integration

## Provider: Dropbox Sign (Embedded)

**Callable**: `createEsignLink({ caseId, fileUrl, signer:{name,email} })`

**Returns**: short-lived sign_url to share with customer

**Tracking**: `cases/{id}/docs` stores requestId, signatureId, status

**Webhook**: `dropboxSignWebhook` flips status to completed/partially-signed

## Employee Flow

1. Case Detail → Send for e-sign
2. Enter customer name/email + PDF URL (or select from Library)
3. Generate link → Share via Messages/Email/Copy or in-app preview

## Security

- Secrets stored in Functions config
- Admin SDK performs provider calls
- Firestore rules allow authed read/create of docs; system updates via Admin SDK