# CRM Data Model & Permissions

## Overview

The CRM layer adds comprehensive case management on top of the emergency incident system. Every alert/incident automatically gets a corresponding case for workflow management.

## Data Structure

### Core Collections

```
cases/{caseId}
├── notes/{noteId}
├── tasks/{taskId}  
├── docs/{docId}
└── timeline/{eventId}
```

### 1. Cases Collection (`cases/{caseId}`)

**Purpose**: 1:1 mapping with alerts/incidents for case workflow management

**Fields**:
- `alertRef`: Reference to source incident (`{source:'alerts'|'incidents', id:string}`)
- `status`: Case workflow status (`new|assigned|responding|on-scene|in-progress|resolved|closed`)
- `priority`: Case priority (`low|medium|high|critical`) 
- `assignedTo`: Employee UID assigned to case
- `homeowner`: Contact info (supervisor-controlled)
- `customer`: Optional customer info
- `createdAt/updatedAt`: Timestamps

### 2. Case Subcollections

**Notes** (`cases/{caseId}/notes/{noteId}`):
- Employee and supervisor notes
- Author attribution with role
- Immutable after creation

**Tasks** (`cases/{caseId}/tasks/{taskId}`):
- Action items for case resolution
- Assignable to specific employees
- Toggleable completion status

**Documents** (`cases/{caseId}/docs/{docId}`):
- PDF uploads and file attachments
- Upload attribution and timestamps
- Linked to Firebase Storage

**Timeline** (`cases/{caseId}/timeline/{eventId}`):
- Automatic logging of all case events
- Response status changes
- Media uploads, chat messages
- Case status modifications

## Permission Matrix

### Employee Permissions

**✅ Can Do:**
- Read all cases, notes, tasks, documents
- Create notes and tasks  
- Upload documents and media
- Update incident `employeeInputs` fields:
  - ETA minutes
  - On-scene report
  - Contact attempted flag
  - Secondary phone number
- Mark tasks as complete
- Send chat messages

**❌ Cannot Do:**
- Change case status or assignments
- Edit homeowner contact information
- Delete notes, tasks, or documents
- Modify other employees' inputs

### Supervisor Permissions

**✅ Can Do (All Employee Permissions Plus):**
- Change case status and priority
- Assign cases to employees
- Edit homeowner contact information
- Review employee inputs and apply to canonical fields
- Delete cases, notes, tasks (with proper authorization)
- View live responder locations
- Receive push notifications when employees respond

**❌ Cannot Do:**
- Modify immutable audit logs (responses, timeline)
- Edit other supervisors' notes without proper escalation

### Customer Permissions

**✅ Can Do:**
- Read incidents relevant to their cases
- View basic case status updates
- Send chat messages (if enabled)

**❌ Cannot Do:**
- Access internal notes or tasks
- View employee information or locations
- Modify any case data

## Employee-Safe Incident Edits

### Data Structure
```typescript
incident: {
  // ... existing fields ...
  employeeInputs: {
    [employeeUid]: {
      etaMins: number,
      onSceneReport: string,
      contactAttempted: boolean,
      secondaryPhone: string,
      updatedAt: serverTimestamp()
    }
  }
}
```

### Workflow
1. **Employee adds field data** → Stored in `employeeInputs[uid]`
2. **Supervisor reviews** → Can approve and copy to canonical fields
3. **Audit trail maintained** → Original employee input preserved
4. **No conflicts** → Each employee has separate input space

## Data Flow

### Case Creation (Automatic)
```
Alert/Incident Created → Cloud Function Triggers → Case Auto-Created → Timeline Event Logged
```

### Response Workflow
```
Employee RESPOND → Response Logged → Supervisor Notified → Location Tracking Starts → Timeline Updated
```

### Information Flow
```
Employee Input → employeeInputs[uid] → Supervisor Review → Canonical homeowner fields → Case Updated
```

## Security Considerations

### Access Control
- **Firestore Rules** enforce server-side permissions
- **UI Role Gates** provide client-side UX
- **Audit Logging** tracks all modifications
- **Immutable Logs** prevent tampering with response history

### Data Integrity
- **Schema Validation** ensures consistent data structure
- **Required Fields** prevent incomplete case creation
- **Atomic Updates** maintain consistency across subcollections
- **Conflict Resolution** through employee input separation

## Integration Points

### Existing Systems
- **Incidents** → Automatic case creation
- **Maps** → Location data flows to case timeline
- **Chat** → Messages logged to case timeline
- **Media** → Uploads tracked in case documents
- **Push Notifications** → Status changes trigger alerts

### External Services
- **E-sign Integration** → PDF library supports DocuSign/HelloSign
- **Payment Processing** → Cash App/Venmo handles for emergency compensation
- **Geocoding** → Address resolution for accurate mapping
- **Analytics** → Response time and efficiency metrics

This CRM model provides comprehensive case management while maintaining the real-time emergency response capabilities that make EMU Alerts powerful for campus safety teams.