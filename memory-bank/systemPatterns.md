# System Patterns: EMU Alerts Clean

## System Architecture ✅ **IMPLEMENTED**

### Current Production Architecture
```
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│   React Native App   │    │      Firebase        │    │    Cloud Firestore  │
│                      │    │                      │    │                      │
│ • 4-Tab Navigation   │◄──►│ • Authentication     │◄──►│ • incidents (live)   │
│ • Incident List      │    │ • Functions          │    │ • Real-time updates  │
│ • Detail Views       │    │ • Storage            │    │ • Security rules     │
│ • Real-time Updates  │    │ • Hosting            │    │ • Automatic scaling  │
└──────────────────────┘    └──────────────────────┘    └──────────────────────┘
           │                           │
           ▼                           ▼
┌──────────────────────┐    ┌──────────────────────┐
│   Expo Notifications │    │   External Services  │
│                      │    │                      │
│ • Push notifications │    │ • EMU Systems (TBD)  │
│ • Local scheduling   │    │ • Email/SMS (TBD)    │
│ • Badge management   │    │ • Maps/Geocoding     │
└──────────────────────┘    └──────────────────────┘
```

## ✅ **Implemented Core Components**

### Mobile Application Layer
- **Navigation Stack**: Expo Router with Stack + Tab navigation
- **Incident List Screen**: Real-time incident feed with filtering
- **Incident Detail Screen**: Full incident view with timeline
- **Tab Navigation**: 4 tabs (Incidents, Favorites, Chat, Profile)
- **State Management**: Custom React hooks with Firebase integration

### Data Management Layer  
- **useIncidents Hook**: Real-time collection listener with filtering
- **useIncident Hook**: Individual incident details with timeline
- **Firebase Config**: Centralized configuration and authentication
- **Real-time Updates**: onSnapshot listeners for live data
- **Offline Support**: Firebase automatic caching and sync

### Firebase Backend Services
- **Firestore Database**: Real-time NoSQL with automatic scaling
- **Authentication Service**: User management and security
- **Cloud Functions**: Server-side logic (when needed)
- **Security Rules**: Data validation and access control
- **Storage Service**: File and media management

## ✅ **Implemented Design Patterns**

### Frontend Patterns
- **Hook Pattern**: Custom hooks for data and state management
- **Component Composition**: Reusable UI components
- **Provider Pattern**: Context for global state (when needed)  
- **Observer Pattern**: Firebase onSnapshot for real-time updates
- **Navigation Pattern**: File-based routing with Expo Router

### Data Patterns
- **Repository Pattern**: Firebase abstracts database operations
- **Real-time Subscription**: onSnapshot pattern for live data
- **Optimistic Updates**: Firebase handles optimistic UI updates
- **Caching Strategy**: Firebase provides automatic local caching
- **Error Boundary**: React error boundaries for fault tolerance

### State Management Patterns
- **Custom Hooks**: Encapsulate business logic and data fetching
- **Local Component State**: useState for UI state
- **Server State**: Firebase real-time subscriptions
- **Derived State**: Computed values from base state
- **Loading States**: Proper loading/error/success patterns

## ✅ **Component Relationships**

### Screen Hierarchy
```
App (_layout.tsx)
├── Auth Stack
│   └── Login Screen
├── Main Tabs (_layout.tsx)
│   ├── Incidents (index.tsx)
│   ├── Favorites 
│   ├── Chat
│   └── Profile
└── Modal Screens
    ├── Incident Detail ([id].tsx)
    └── Chat Detail ([id].tsx)
```

### Data Flow Architecture
```
Firestore Collection → useIncidents Hook → Incident List → Navigation → useIncident Hook → Incident Detail
                                    ↓
                             Real-time Updates
                                    ↓
                            Component Re-render
```

## ✅ **Implemented Architecture Principles**

### Separation of Concerns
- ✅ **UI Components**: Pure presentation components
- ✅ **Business Logic**: Custom hooks handle data operations
- ✅ **Data Layer**: Firebase handles persistence and sync
- ✅ **Navigation**: Expo Router manages screen transitions
- ✅ **Configuration**: Environment variables for settings

### Scalability & Performance
- ✅ **Real-time Scaling**: Firestore handles concurrent connections
- ✅ **Optimized Rendering**: React Native performance patterns
- ✅ **Lazy Loading**: Screen-based code splitting
- ✅ **Caching Strategy**: Firebase automatic local caching
- ✅ **Network Efficiency**: Real-time subscriptions minimize requests

### Reliability & Error Handling
- ✅ **Error Boundaries**: React error boundaries in place
- ✅ **Network Resilience**: Firebase handles offline scenarios
- ✅ **Type Safety**: TypeScript prevents runtime errors
- ✅ **Loading States**: Proper loading/error UI patterns
- ✅ **Graceful Degradation**: App works offline with cached data

### Security & Data Protection
- ✅ **Firebase Security**: Firestore rules control data access
- ✅ **Authentication**: Firebase Auth for user management
- ✅ **Environment Variables**: Sensitive config in .env files
- ✅ **Type Safety**: TypeScript prevents data corruption
- ✅ **Secure Transport**: HTTPS for all Firebase connections

## ✅ **Data Schema & Structure**

### Firestore Collections
```typescript
// incidents collection
{
  id: string
  alertId: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'resolved' | 'investigating'  
  timestamp: Timestamp
  location?: string
  category: string
  source: string
  updates: IncidentUpdate[]
  notificationsSent: number
  affectedAreas?: string[]
}

// users collection (when auth is enabled)
{
  id: string
  email: string
  displayName?: string
  preferences: {...}
}
```

### Component Interface Patterns
```typescript
// Hook return patterns
interface IncidentsState {
  incidents: Incident[]
  loading: boolean
  error: string | null
  getActiveIncidents(): Incident[]
  getIncidentsBySeverity(severity): Incident[]
}

// Component prop patterns
interface IncidentCardProps {
  incident: Incident
  onPress: (incident: Incident) => void
}
```

## ✅ **Integration Patterns**

### Current Integrations
- **Firebase Services**: Firestore + Auth + Functions + Storage
- **Expo Services**: Router + Notifications + Maps + Constants
- **React Native**: Core platform with native module access
- **Development Tools**: TypeScript + ESLint + cSpell

### Future Integration Points
- **EMU Systems**: Authentication, user directory, alerts
- **Notification Services**: Push, Email, SMS providers  
- **Maps & Location**: Enhanced location-based features
- **Analytics**: Usage tracking and incident metrics

## ✅ **Quality Attributes Achieved**

### Performance ⚡
- Real-time updates with minimal latency
- Optimized React Native rendering
- Firebase CDN and caching
- Lazy-loaded screens and components

### Availability 🔄
- Firebase 99.9% uptime SLA
- Offline support with local caching  
- Error recovery and retry logic
- Graceful degradation patterns

### Security 🔒
- Firebase security rules
- Authentication flows ready
- Environment variable protection
- Type-safe data handling

### Usability 📱
- Native mobile UI patterns
- Intuitive navigation flow
- Real-time feedback
- Consistent design system

**Status**: 🟢 **Production-Ready Architecture Implemented**

*Last Updated: September 19, 2025*
