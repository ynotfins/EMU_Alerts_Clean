# System Patterns: EMU Alerts Clean

## System Architecture (Implemented)

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Firebase      │    │  Push Notifications │
│  (React Native) │◄──►│   Backend       │◄──►│  (FCM + Expo)   │
│                 │    │                 │    │                 │
│ • Authentication│    │ • Firestore DB  │    │ • Critical Alerts│
│ • Incident List │    │ • Firebase Auth │    │ • Real-time     │
│ • Real-time UI  │    │ • Cloud Functions│   │ • Cross-platform│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Local Storage │    │   External APIs │
│  (AsyncStorage) │    │  (Maps, etc.)   │
│                 │    │                 │
│ • Offline Data  │    │ • Location Data │
│ • User Prefs    │    │ • Map Services  │
└─────────────────┘    └─────────────────┘
```

### Core Components (Implemented)
- **Mobile Frontend**: React Native app with Expo Router
- **Authentication System**: Firebase Auth with persistent sessions
- **Real-Time Database**: Firestore with live listeners
- **Push Notification Engine**: Expo Notifications + Firebase Cloud Messaging
- **Incident Management**: CRUD operations for emergency incidents
- **Offline Support**: AsyncStorage for critical data caching

## Key Technical Decisions (Made)

### Architecture Patterns
- **Mobile-First Design**: Native mobile app as primary interface
- **Real-Time Architecture**: Firestore real-time listeners for live updates
- **Component-Based UI**: React Native functional components with hooks
- **File-Based Routing**: Expo Router for navigation structure
- **Hook-Based State**: Custom hooks for data management (useAuth, useIncidents)

### Design Patterns Implemented
- **Custom Hooks Pattern**: Centralized logic in reusable hooks
- **Provider Pattern**: Authentication context across app
- **Observer Pattern**: Real-time Firestore listeners
- **Repository Pattern**: Data access abstraction in hooks
- **Presentation Pattern**: Separation of UI components and business logic

### Component Relationships
```
App Root (_layout.tsx)
├─ Authentication Provider (useAuth)
├─ Tab Navigation
│  ├─ Home (Incidents List) - useIncidents hook
│  ├─ Favorites - Local storage integration
│  ├─ Chat - Emergency communication
│  └─ Profile - User management
├─ Auth Flow (login.tsx) - Firebase Auth
└─ Incident Details ([id].tsx) - useIncident hook
```

### Data Flow (Implemented)
1. **Authentication**: Firebase Auth → useAuth hook → App-wide context
2. **Incidents**: Firestore → useIncidents hook → Real-time UI updates
3. **Notifications**: Firebase Cloud Messaging → Expo Notifications → User alerts
4. **Navigation**: User interaction → Expo Router → Screen transitions
5. **Offline**: Critical data → AsyncStorage → Local cache

## Architecture Principles (Applied)

### Implementation Guidelines
- **Separation of Concerns**: Business logic in hooks, UI in components
- **Real-Time First**: Live data updates via Firestore listeners
- **Mobile Optimization**: Touch-friendly UI, offline support
- **Type Safety**: TypeScript throughout with strict configuration
- **Cross-Platform**: Single codebase for iOS/Android/Web

### Quality Attributes (Achieved)
- **Performance**: Real-time updates, optimized React Native performance
- **Availability**: Offline data caching, Firebase reliability
- **Security**: Firebase Auth, secure data transmission
- **Usability**: Native mobile UI patterns, emergency-focused design
- **Maintainability**: TypeScript, component architecture, documentation

## Data Architecture

### Firestore Collections
```typescript
// Incidents Collection Structure
interface Incident {
  id: string;              // Document ID
  alertId: string;         // Unique alert identifier for deduplication
  title: string;           // Incident title
  description: string;     // Detailed description
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'investigating' | 'resolved';
  timestamp: Timestamp;    // When incident occurred
  location?: string;       // Incident location
  category: string;        // Type of incident
  source: string;          // Alert source system
  updates: IncidentUpdate[]; // Timeline of updates
  affectedAreas?: string[]; // Campus areas affected
}
```

### Authentication Model
- **Firebase Auth**: Email/password authentication
- **Persistent Sessions**: AsyncStorage integration for mobile
- **Cross-Platform**: Consistent auth state across platforms

### Local Storage Strategy
- **Critical Data**: Incidents cached for offline access
- **User Preferences**: Notification settings, app preferences
- **Authentication**: Session tokens and user data

## Integration Patterns (Implemented)

### Firebase Integration
- **Authentication**: Firebase Auth with React Native persistence
- **Database**: Firestore real-time listeners for live data
- **Push Notifications**: Firebase Cloud Messaging integration
- **Analytics**: Firebase Analytics for usage tracking

### External Service Integration
- **Maps**: React Native Maps for location visualization
- **Notifications**: Expo Notifications API for cross-platform alerts
- **Storage**: AsyncStorage for offline data persistence
- **Navigation**: Expo Router for file-based routing

### Platform Integration
- **iOS**: Native iOS features via Expo managed workflow
- **Android**: Native Android features via Expo managed workflow
- **Web**: Progressive Web App capabilities
- **Push Notifications**: Platform-specific notification channels

## Scalability Patterns

### Performance Optimization
- **Real-Time Listeners**: Efficient Firestore queries with pagination
- **Component Optimization**: React.memo and useMemo where appropriate
- **Image Optimization**: Expo asset optimization
- **Bundle Optimization**: Code splitting via Expo Router

### Reliability Patterns
- **Offline Support**: Critical data cached locally
- **Error Boundaries**: Graceful error handling
- **Retry Logic**: Network request retry patterns
- **Fallback UI**: Offline mode indicators

## Security Architecture

### Authentication Security
- **Firebase Auth**: Industry-standard authentication
- **Secure Storage**: AsyncStorage for sensitive data
- **Session Management**: Automatic token refresh

### Data Security
- **Firestore Rules**: Database access control (development mode)
- **Environment Variables**: Sensitive configuration management
- **Network Security**: HTTPS/TLS for all communications

*Last Updated: September 19, 2025*
