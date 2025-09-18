# EMU Alerts

A React Native mobile application for Emergency Management University (EMU) alert system. This app provides real-time emergency notifications, incident tracking, and emergency communication capabilities for EMU campus safety.

## Features

- 🚨 **Real-time Emergency Alerts**: Live incident notifications with severity levels
- 📱 **Cross-Platform**: iOS, Android, and Web support via React Native/Expo
- 🔥 **Firebase Integration**: Real-time database, authentication, and push notifications
- 📊 **Incident Timeline**: Detailed incident tracking with update history
- 👤 **User Authentication**: Secure sign-in with Firebase Auth
- 🔔 **Push Notifications**: Critical emergency alerts sent to devices
- 📍 **Location-Aware**: Incident location tracking and affected area mapping

## Technology Stack

- **Framework**: React Native with Expo Router
- **Backend**: Firebase (Firestore, Auth, Cloud Messaging)
- **Navigation**: Expo Router with tab navigation
- **UI**: Custom components with Expo Vector Icons
- **Push Notifications**: Expo Notifications
- **Language**: TypeScript with strict type checking

## Getting Started

### Prerequisites

- Node.js 18+ 
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Firebase project configured

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd emu-alerts
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Firebase configuration values in `.env`:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   # ... other Firebase config values
   ```

4. **Firebase Setup**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication with Email/Password
   - Set up Firestore database
   - Add iOS/Android apps and download config files:
     - `google-services.json` → `credentials/`
     - `GoogleService-Info.plist` → `credentials/`

5. **Assets Setup**
   - Add app icons to `assets/` directory
   - See `assets/README.md` for specific requirements

### Running the App

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator  
npm run android

# Run in web browser
npm run web
```

## Project Structure

```
EMU-Alerts/
├─ app.config.ts               # Expo configuration
├─ firebase.config.ts          # Firebase initialization
├─ hooks/                      # Custom React hooks
│  ├─ useAuth.ts              # Authentication logic
│  ├─ useIncidents.ts         # Incidents data management
│  └─ useIncident.ts          # Single incident details
├─ app/                        # App screens (Expo Router)
│  ├─ _layout.tsx             # Root navigation
│  ├─ (tabs)/                 # Tab navigation
│  │  ├─ index.tsx            # Incidents list
│  │  ├─ favorites.tsx        # Favorites screen
│  │  ├─ chat.tsx             # Emergency chat
│  │  └─ profile.tsx          # User profile
│  ├─ (auth)/
│  │  └─ login.tsx            # Authentication
│  └─ incident/
│     └─ [id].tsx             # Incident details
├─ app/notifications-setup.ts  # Push notifications
├─ assets/                     # App icons and images
├─ credentials/               # Firebase config files (gitignored)
└─ docs/                      # Documentation
```

## Key Components

### Authentication (`hooks/useAuth.ts`)
- Firebase Auth integration
- Email/password authentication
- Auto-redirect based on auth state

### Incident Management (`hooks/useIncidents.ts`)
- Real-time Firestore integration
- Incident deduplication by alertId
- Filtering by status and severity

### Navigation
- Expo Router with typed routes
- Tab navigation for main screens
- Modal presentation for incident details

### Push Notifications
- Permission handling
- Foreground notification display
- Emergency channel configuration
- Badge count management

## Database Schema

### Incidents Collection
```typescript
interface Incident {
  id: string;              // Document ID
  alertId: string;         // Unique alert identifier
  title: string;           // Incident title
  description: string;     // Detailed description
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'investigating' | 'resolved';
  timestamp: Timestamp;    // When incident occurred
  location?: string;       // Incident location
  category: string;        // Type of incident
  source: string;          // Alert source system
  updates: IncidentUpdate[]; // Timeline updates
  affectedAreas?: string[]; // Campus areas affected
}
```

## Development

### Code Style
- TypeScript strict mode enabled
- Consistent import/export patterns
- Component-based architecture

### Testing
```bash
# Run type checking
npx tsc --noEmit

# Run linting (if configured)
npm run lint
```

### Building
```bash
# Create production build
expo build

# Using EAS Build (recommended)
eas build
```

## Deployment

### Prerequisites
- EAS CLI installed: `npm install -g @expo/eas-cli`
- EAS account configured: `eas login`

### Steps
1. Configure `app.config.ts` with production settings
2. Set up EAS project: `eas init`
3. Build for stores: `eas build --platform all`
4. Submit to stores: `eas submit`

## Environment Variables

Required environment variables (see `.env.example`):

```bash
# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

# EAS/Expo
EAS_PROJECT_ID=

# App Configuration  
IOS_BUNDLE_ID=com.emu.alerts
ANDROID_PACKAGE=com.emu.alerts
```

## Troubleshooting

### Common Issues

**Firebase Connection Issues**
- Verify `.env` file has correct Firebase config
- Check that `credentials/` folder has the required files
- Ensure Firestore security rules allow read/write

**Push Notifications Not Working**
- Verify notification permissions are granted
- Check EAS project ID is correctly configured
- Ensure Firebase Cloud Messaging is enabled

**Build Errors**
- Clear Expo cache: `expo start --clear`
- Delete `node_modules` and reinstall
- Check for TypeScript errors: `npx tsc --noEmit`

**Navigation Issues**
- Ensure all required screens are implemented
- Check `app/_layout.tsx` for route configuration
- Verify authentication flow redirects

### Debug Mode

```bash
# Start with debug logging
EXPO_DEBUG=1 npm start

# View logs
npx expo logs
```

## Contributing

1. Follow the existing code patterns
2. Add TypeScript types for new features
3. Update documentation for new functionality
4. Test on both iOS and Android simulators

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For technical issues:
1. Check this README and troubleshooting section
2. Review Firebase console for backend issues
3. Check Expo documentation for platform-specific issues

For EMU-specific requirements, contact the EMU Emergency Management team.