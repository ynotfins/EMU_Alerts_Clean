# Post-merge verification checklist

- [ ] `npx expo-doctor` clean
- [ ] `npm run typecheck` passes
- [ ] Sign-in, Firestore stream, chat, media uploads OK
- [ ] Push token capture & tools/send-push.js OK
- [ ] Maps + RESPOND deep-link works (iOS/Android/Web)
- [ ] Supervisor map shows live presence
- [ ] CRM: cases, notes, tasks, docs visible
- [ ] Role-based UI gates correct (employee/supervisor/customer)
- [ ] Firestore rules enforce permissions
- [ ] CI status green on PR
