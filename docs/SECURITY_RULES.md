# Firestore Security Model

## Roles

**employee**: field operations, notes/tasks/docs creation, incident employeeInputs updates

**supervisor**: manages canonical incident homeowner fields, case status/assignments, docs

**customer**: read-only incidents/cases as applicable

## Helper
```javascript
function userRole() {
  return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
}
```

## Presence
```javascript
match /users/{uid}/presence/{doc} {
  allow write: if request.auth != null && request.auth.uid == uid;
  allow read: if request.auth != null && (request.auth.uid == uid || userRole() == 'supervisor');
}
```

## Cases
```javascript
match /cases/{caseId} {
  allow read: if request.auth != null;
  allow update: if request.auth != null && userRole() == 'supervisor';
}

match /cases/{caseId}/notes/{noteId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
}

match /cases/{caseId}/tasks/{taskId} {
  allow read, create, update: if request.auth != null;
}

match /cases/{caseId}/docs/{docId} {
  allow read, create: if request.auth != null;
}
```

## Incidents
```javascript
match /incidents/{id} {
  allow update: if request.auth != null && (
    userRole() == 'supervisor' ||
    request.resource.data.diff(resource.data).affectedKeys().hasOnly(['employeeInputs'])
  );
}
```

**Admin SDK** (Cloud Functions) bypasses rules for system writes (geocode/auto-case/webhooks).