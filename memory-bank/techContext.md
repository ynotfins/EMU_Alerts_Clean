# Technical Context: EMU Alerts Clean

## Technology Stack
**IMPLEMENTED AND DEPLOYED**

### Current Status
- **Platform**: Expo React Native (SDK 54, Managed)
- **Environment**: Windows development environment with PowerShell
- **Package Manager**: npm (as implemented in project)
- **Frontend**: React Native with TypeScript, Expo Router
- **Backend**: Firebase (Firestore, Auth, Functions, Storage)
- **Mobile**: iOS, Android, Web compatibility

### Implemented Technology Stack

#### Backend (IMPLEMENTED)
- **Firebase Cloud Functions**: Node.js serverless functions
- **Firebase Firestore**: NoSQL database with real-time sync
- **Firebase Authentication**: User authentication and role management
- **Firebase Storage**: File and media storage

#### Frontend (IMPLEMENTED)
- **Expo React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe development
- **Expo Router**: File-based routing system
- **React Native Maps**: Location and mapping services

#### Database (IMPLEMENTED)
- **Firestore**: Real-time NoSQL database
- **Security Rules**: Role-based data access control
- **Offline Support**: Client-side caching and sync

#### Services (IMPLEMENTED)
- **Expo Notifications**: Push notification system
- **Firebase Authentication**: User management
- **Google Maps API**: Geocoding and location services
- **Cloud Functions**: Server-side business logic

## Development Setup

### Current Environment
- **OS**: Linux 6.12.8+
- **Shell**: /usr/bin/bash
- **Git**: Repository initialized and clean
- **Working Directory**: /workspace

### Development Tools (Preferences)
- **Package Manager**: pnpm
- **Build Tool**: Turbopack (for Next.js)
- **Testing**: Vitest (run before pushing changes)
- **Code Quality**: Linting and formatting tools
- **Agent Mode**: Terminal commands run automatically

### Installation Standards
- Use non-interactive flags (-y)
- Apply sensible defaults
- Always run tests before pushing changes
- Iterate until tests are green

## Technical Constraints

### Requirements (Assumed)
- **Reliability**: High availability for emergency alerts
- **Scalability**: Handle varying alert volumes
- **Security**: Protect user data and prevent spam
- **Performance**: Fast alert delivery (< 5 minutes urgent)
- **Maintainability**: Clean, documented codebase

### Integration Constraints
- May need integration with EMU systems
- Authentication requirements (LDAP, SSO)
- Compliance requirements (FERPA, etc.)
- Network/firewall considerations

## Dependencies
*To be defined as technology stack is chosen*

### Core Dependencies (Planned)
- Web framework
- Database driver/ORM
- Authentication library
- Notification service SDKs
- Testing framework
- Build and deployment tools

### Development Dependencies
- Linting tools (ESLint, etc.)
- Code formatting (Prettier)
- Type checking (TypeScript if chosen)
- Testing utilities
- Development servers

## Deployment Considerations
- **Environment**: TBD (cloud vs on-premise)
- **CI/CD**: Automated testing and deployment
- **Monitoring**: Application and alert delivery monitoring
- **Backup**: Database and configuration backup
- **Scaling**: Horizontal scaling for high loads

*Last Updated: September 18, 2025*
