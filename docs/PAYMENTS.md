# Payments

## Profile Setup

Users add `$cashapp` and `@venmo` handles under `users/{uid}`

UI shows "Active" if either is set

## Deep-Links

- **Cash App**: `https://cash.app/<handle>`
- **Venmo**: `venmo://users/<handle>` (fallback to `https://venmo.com/<handle>`)

## Security

Users may update only their own handles

Supervisors can see status for coordination
