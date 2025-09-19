# Technical Context: EMU Alerts Mobile App

## Technology Stack - IMPLEMENTED

### Frontend/Mobile
- **Framework**: React Native 0.81.4 with Expo SDK 54
- **Navigation**: Expo Router 6.0.7 (file-based routing)
- **Language**: TypeScript for type safety
- **UI Components**: React Native core components + Ionicons
- **State Management**: React hooks with custom hooks architecture

### Backend/Services
- **Database**: Firebase Firestore (NoSQL, real-time)
- **Authentication**: Firebase Auth with email/password
- **Push Notifications**: Expo Notifications + Firebase Cloud Messaging
- **File Storage**: Firebase Storage (configured but not actively used)
- **Real-time Sync**: Firestore real-time listeners

### Development Environment
- **OS**: Linux 6.12.8+ development environment
- **Package Manager**: pnpm (as specified in preferences)
- **Shell**: /usr/bin/bash
- **Git**: Version control with main branch
- **IDE**: Cursor with TypeScript support

## Architecture Implementation

### Project Structure
```
app/
├── (auth)/
│   └── login.tsx           # Authentication screen
├── (tabs)/
│   ├── _layout.tsx         # Tab navigation
│   ├── index.tsx          # Incidents feed (main)
│   ├── favorites.tsx      # Favorites screen
│   ├── chat.tsx           # Chat screen
│   └── profile.tsx        # Profile screen
├── incident/
│   └── [id].tsx           # Dynamic incident detail
├── _layout.tsx            # Root layout with auth routing
└── notifications-setup.ts # Notification configuration
```

### Key Dependencies
#### Core Production Dependencies
- **expo**: ^54.0.0 - Expo platform
- **react**: 19.1.0 - React framework
- **react-native**: 0.81.4 - Native platform
- **firebase**: ^10.14.1 - Backend services
- **expo-router**: ~6.0.6 - Navigation
- **expo-notifications**: ~0.32.11 - Push notifications
- **react-native-maps**: 1.20.1 - Maps integration

#### Development Dependencies
- **typescript**: ^5.9.2 - Type checking
- **@types/react**: ~19.1.10 - React types
- **jest**: ^29.7.0 - Testing framework
- **babel-plugin-module-resolver**: ^5.0.2 - Import resolution

## Firebase Configuration

### Services Used
1. **Firestore Database**: Real-time incident storage
2. **Firebase Auth**: User authentication system
3. **Cloud Messaging**: Push notification backend
4. **Firebase Hosting**: Configuration management

### Database Schema
```typescript
interface Incident {
  id: string;
  alertId: string;          // Deduplication key
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'investigating';
  timestamp: Date;
  location?: string;
  category: string;
  source: string;
  updates: IncidentUpdate[];
  notificationsSent: number;
  affectedAreas?: string[];
}
```

## Development Setup - COMPLETED

### Environment Configuration
- **Firebase Config**: Environment variables for API keys
- **Platform Config**: app.config.ts with iOS/Android settings
- **Notifications**: Android channels configured for emergency alerts
- **Authentication**: Firebase Auth with persistence
- **Real-time**: Firestore listeners for live updates

### Build Configuration
- **EAS Project ID**: b40c82be-f4b7-4f9a-8fa1-b0126cb45366
- **Bundle ID (iOS)**: com.emualerts.ios (from GoogleService-Info.plist)
- **Package (Android)**: com.emualerts
- **Permissions**: Location, notifications, wake lock, vibrate

## Performance & Scalability

### Real-time Architecture
- **Firebase Listeners**: Automatic UI updates on data changes
- **Incident Deduplication**: By alertId to merge related updates
- **Optimized Queries**: Firestore compound queries with indexing
- **Pagination Ready**: Limit queries (currently 50 incidents)

### Notification System
- **Expo Push Notifications**: Cross-platform push delivery
- **Emergency Channels**: High-priority Android notification channels
- **Background Handling**: Configured for foreground/background notifications
- **Badge Management**: Automatic badge count updates

## Security Implementation

### Authentication
- **Firebase Auth**: Secure email/password authentication
- **Session Persistence**: AsyncStorage integration for mobile
- **Auto-routing**: Redirect based on auth state
- **Error Handling**: Comprehensive auth error management

### Data Security
- **Firestore Rules**: Basic security (needs production hardening)
- **Environment Variables**: Secure API key management
- **HTTPS**: All Firebase communication over HTTPS
- **Input Validation**: Client-side validation with server-side backup

## Testing & Quality

### Built-in Testing
- **Jest Configuration**: Unit testing framework setup
- **Test Utilities**: Built-in test buttons for notifications/Firestore
- **Manual Testing**: Comprehensive incident flow testing
- **Real-time Testing**: Live Firebase connection testing

### Code Quality
- **TypeScript**: Full type safety across the application
- **ESLint**: Code linting configuration
- **Modular Architecture**: Separation of concerns with custom hooks
- **Error Boundaries**: Comprehensive error handling

## Deployment Status

### Current State
✅ **Development Ready**: Full local development environment
✅ **Firebase Connected**: Production Firebase project configured
✅ **Cross-platform**: iOS and Android builds supported
✅ **EAS Integration**: Ready for Expo Application Services deployment
✅ **Testing Tools**: Built-in testing and debugging tools

### Production Readiness
- **Environment**: Configured for development and production
- **Monitoring**: Firebase console integration
- **Updates**: Over-the-air updates via Expo
- **Certificates**: Google Services configuration files included
- **Performance**: Real-time optimizations implemented

*Last Updated: September 19, 2025*
