# Technical Context: EMU Alerts Clean

## Technology Stack (Implemented)

### Current Implementation
- **Platform**: React Native with Expo SDK 54
- **Backend**: Firebase (Firestore, Auth, Cloud Messaging)
- **Development Environment**: Linux development environment
- **Package Manager**: npm (with package-lock.json in place)
- **Language**: TypeScript with strict type checking

### Core Technologies

#### Frontend Stack
- **React Native**: Cross-platform mobile development
- **Expo Router**: File-based navigation system
- **Expo SDK**: Comprehensive development platform
- **TypeScript**: Type safety and developer experience
- **Expo Vector Icons**: Icon library for UI components

#### Backend Services
- **Firebase Firestore**: Real-time NoSQL database
- **Firebase Auth**: User authentication with email/password
- **Firebase Cloud Messaging**: Push notifications
- **Firebase Analytics**: Usage tracking and insights

#### Development Tools
- **Expo CLI**: Development server and build tools
- **React Native Reanimated**: Smooth animations
- **React Native Gesture Handler**: Touch gesture management
- **React Native Maps**: Location and mapping features
- **AsyncStorage**: Local data persistence

## Development Setup

### Current Environment
- **OS**: Linux 6.12.8+
- **Shell**: /usr/bin/bash
- **Node.js**: 18+ required
- **Working Directory**: /workspace
- **Git**: Repository with active development

### Build Configuration
- **Expo Config**: `app.config.ts` with EAS project ID
- **TypeScript**: `tsconfig.json` with strict settings
- **Babel**: Custom module resolution configuration
- **EAS Build**: Production build system configured

### Dependencies (Implemented)
```json
{
  "expo": "^54.0.0",
  "react": "19.1.0",
  "react-native": "0.81.4",
  "firebase": "^10.14.1",
  "expo-router": "~6.0.6",
  "expo-notifications": "~0.32.11",
  "react-native-maps": "1.20.1",
  "typescript": "^5.9.2"
}
```

## Architecture Implementation

### App Structure
```
app/
├─ _layout.tsx              # Root navigation layout
├─ (tabs)/                  # Tab navigation group
│  ├─ _layout.tsx          # Tab layout configuration
│  ├─ index.tsx            # Incidents list (home)
│  ├─ favorites.tsx        # Favorites screen
│  ├─ chat.tsx             # Emergency chat
│  └─ profile.tsx          # User profile
├─ (auth)/
│  └─ login.tsx            # Authentication screen
├─ incident/
│  └─ [id].tsx             # Dynamic incident details
└─ notifications-setup.ts   # Push notification config
```

### Data Layer
- **Firestore Collections**: `incidents` with real-time listeners
- **Authentication**: Firebase Auth with AsyncStorage persistence
- **Local Storage**: AsyncStorage for offline data and preferences
- **Real-Time Updates**: Firestore real-time listeners for live data

### Custom Hooks
- **useAuth**: Authentication state management
- **useIncidents**: Real-time incidents data fetching
- **useIncident**: Individual incident details management

## Technical Constraints (Actual)

### Performance Requirements
- **Real-Time Updates**: Sub-second incident updates via Firestore
- **Push Notifications**: Immediate delivery for critical alerts
- **Offline Support**: Critical data cached locally
- **Cross-Platform**: Consistent performance on iOS/Android/Web

### Security Implementation
- **Firebase Auth**: Secure authentication with persistence
- **Firestore Rules**: Database security (development mode active)
- **Environment Variables**: Sensitive config in `.env` files
- **Platform Security**: Native app security features

### Integration Points
- **Firebase Services**: Fully integrated backend
- **Push Notifications**: Expo Notifications + Firebase Cloud Messaging
- **Maps Integration**: React Native Maps for location features
- **Cross-Platform**: Expo managed workflow for deployment

## Deployment Configuration

### Environment Setup
- **Firebase Project**: Development project configured
- **EAS Project**: `b40c82be-f4b7-4f9a-8fa1-b0126cb45366`
- **Environment Variables**: Firebase config via EXPO_PUBLIC_* vars
- **Credentials**: Firebase config files in credentials/ (gitignored)

### Build Targets
- **iOS**: Native iOS app via EAS Build
- **Android**: Native Android app via EAS Build
- **Web**: Progressive Web App via Expo Web

### CI/CD Ready
- **EAS Build**: Production build system configured
- **EAS Submit**: App store submission ready
- **Over-the-Air Updates**: Expo OTA update capability
- **Environment Management**: Development/staging/production configs

## Development Workflow

### Current Standards
- **TypeScript**: Strict type checking enabled
- **Code Quality**: ESLint configuration (if present)
- **Testing**: Jest configuration for unit tests
- **Development**: Expo development server with hot reload

### Production Readiness
- **Security**: Production Firebase project needed
- **Performance**: Optimization for emergency scenarios
- **Monitoring**: Error tracking and analytics setup
- **Compliance**: Privacy and security audit required

*Last Updated: September 19, 2025*
