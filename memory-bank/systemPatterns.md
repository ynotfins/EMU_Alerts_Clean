# System Patterns: EMU Alerts Mobile App

## System Architecture - IMPLEMENTED

### High-Level Architecture (Current)
```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   React Native      │    │   Firebase          │    │   Expo Platform     │
│   Mobile App        │◄──►│   Backend           │◄──►│   Services          │
│                     │    │                     │    │                     │
│ • Auth Screens      │    │ • Firestore DB     │    │ • Push Notifications│
│ • Incident Feed     │    │ • Authentication    │    │ • OTA Updates       │
│ • Detail Views      │    │ • Cloud Messaging   │    │ • Build Services    │
│ • Tab Navigation    │    │ • Security Rules    │    │ • App Store Deploy │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

### Core Components - IMPLEMENTED
1. **Authentication System** (`hooks/useAuth.ts`)
   - Firebase Auth integration
   - Sign in/sign up flows
   - Session persistence with AsyncStorage
   - Auto-routing based on auth state

2. **Incident Management** (`hooks/useIncidents.ts`, `hooks/useIncident.ts`)
   - Real-time Firestore listeners
   - Incident deduplication by alertId
   - Filtering (all, active, critical)
   - Timeline and update tracking

3. **Navigation System** (Expo Router)
   - File-based routing structure
   - Tab navigation with 4 main screens
   - Modal incident detail views
   - Authentication-aware routing

4. **Notification Engine** (`app/notifications-setup.ts`)
   - Expo push notifications
   - Emergency notification channels
   - Background/foreground handling
   - Badge count management

5. **UI Components** (React Native)
   - Incident cards with severity/status badges
   - Real-time filtering and search
   - Timeline visualization
   - Emergency-focused design system

## Key Technical Decisions - MADE

### Architecture Patterns Implemented
1. **Custom Hooks Pattern**: Separation of business logic
   - `useAuth()`: Authentication state management
   - `useIncidents()`: Real-time incident data
   - `useIncident(id)`: Individual incident details

2. **Real-time Observer Pattern**: Firebase Firestore listeners
   - Automatic UI updates on data changes
   - Optimistic updates for better UX
   - Error handling and retry logic

3. **Component Composition**: Modular UI architecture
   - Reusable incident cards
   - Shared navigation components
   - Consistent styling patterns

4. **Repository Pattern**: Firebase service abstraction
   - Centralized Firebase configuration
   - Environment-based configuration
   - Cross-platform compatibility

### Data Flow - IMPLEMENTED
```
1. User Authentication
   ├── Firebase Auth ──► useAuth() ──► Auto-routing
   └── Session Persistence (AsyncStorage)

2. Incident Data Flow
   ├── Firestore Collection ('incidents')
   ├── Real-time Listener ──► useIncidents()
   ├── State Updates ──► UI Re-render
   └── Incident Deduplication by alertId

3. Notification Flow
   ├── Expo Notifications ──► Permission Request
   ├── Push Token Generation ──► Firebase Registration
   └── Incoming Notifications ──► App Handlers
```

## Component Relationships - DEFINED

### Screen Hierarchy
```
RootLayout (_layout.tsx)
├── Authentication Check
├── Auto-routing Logic
└── Screen Stack
    ├── (auth)/login.tsx
    └── (tabs)/
        ├── index.tsx (Incidents Feed)
        ├── favorites.tsx
        ├── chat.tsx
        ├── profile.tsx
        └── incident/[id].tsx (Modal)
```

### Hook Dependencies
```
useAuth() ──► Firebase Auth
    └── Used by: _layout.tsx, login.tsx

useIncidents() ──► Firestore Collection
    └── Used by: index.tsx (main feed)

useIncident(id) ──► Individual Firestore Document
    └── Used by: incident/[id].tsx
```

## Architecture Principles - ACHIEVED

### Implemented Guidelines
✅ **Separation of Concerns**: Clear hook/component boundaries
✅ **Real-time Architecture**: Firebase listeners for live updates
✅ **Cross-platform Compatibility**: React Native + Expo
✅ **Type Safety**: Full TypeScript implementation
✅ **Security**: Firebase Auth + Firestore security rules
✅ **Maintainability**: Modular code with clear interfaces
✅ **Performance**: Optimized queries and React Native performance

### Quality Attributes - DELIVERED
- **Performance**: Sub-second incident loading with real-time updates
- **Availability**: Firebase infrastructure (99.9% uptime SLA)
- **Security**: Firebase Auth + environment variable protection
- **Usability**: Intuitive emergency-focused mobile interface
- **Reliability**: Real-time data sync with offline capability
- **Scalability**: Firestore auto-scaling with pagination support

## Integration Patterns - ESTABLISHED

### External Service Integration
1. **Firebase Services**
   - Firestore: Real-time database
   - Auth: User authentication
   - Cloud Messaging: Push notifications
   - Configuration via environment variables

2. **Expo Platform Services**
   - Push Notifications: Expo Notifications API
   - Over-the-air Updates: Expo Updates
   - Build Services: EAS Build integration
   - App Store Deployment: EAS Submit

3. **Native Platform Integration**
   - iOS: GoogleService-Info.plist configuration
   - Android: google-services.json configuration
   - Push notification channels and permissions

### Data Integration Patterns
```typescript
// Firestore Document Structure
interface Incident {
  id: string;                    // Firestore document ID
  alertId: string;               // Business deduplication key
  title: string;                 // Display title
  description: string;           // Full description
  severity: 'low'|'medium'|'high'|'critical';
  status: 'active'|'resolved'|'investigating';
  timestamp: Date;               // Created timestamp
  location?: string;             // Optional location
  category: string;              // Incident category
  source: string;                // Alert source system
  updates: IncidentUpdate[];     // Timeline updates
  notificationsSent: number;     // Delivery metrics
  affectedAreas?: string[];      // Geographic impact
}
```

## Design Patterns in Use

### State Management Pattern
- React hooks for local state
- Firebase real-time listeners for global state
- Custom hooks for business logic encapsulation

### Navigation Pattern
- File-based routing with Expo Router
- Authentication-aware routing
- Tab navigation for primary screens
- Modal presentation for details

### Error Handling Pattern
- Try-catch blocks with user-friendly messages
- Firebase error translation
- Fallback UI states for loading/error conditions
- Console logging for debugging

### Notification Pattern
- Permission request on app startup
- Channel configuration for emergency priority
- Background and foreground notification handling
- Badge count management

## Performance Optimizations

### Implemented Optimizations
1. **Firestore Query Optimization**
   - Compound indexes for complex queries
   - Limit queries to prevent over-fetching
   - Real-time listener efficient updates

2. **React Native Performance**
   - FlatList for efficient incident rendering
   - Image optimization and caching
   - Minimal re-renders with proper key props

3. **Memory Management**
   - Proper listener cleanup in useEffect
   - Optimized state updates
   - Lazy loading for incident details

*Last Updated: September 19, 2025*
