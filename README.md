# EMU Alerts - Enterprise Emergency Management System

A comprehensive, real-time emergency response platform built with Expo, React Native, and Firebase. Designed for campus safety teams and emergency responders.

## 🚨 Core Features

### **Real-time Incident Management**
- ✅ **Live Firestore sync** - Incidents update in real-time across all devices
- ✅ **Offline support** - Connection banner shows online/cache status with last sync time
- ✅ **Search & filtering** - Find incidents by address, type, priority, proximity
- ✅ **Priority chips** - One-tap filtering by CRITICAL, HIGH, MEDIUM, LOW
- ✅ **Distance awareness** - Shows "2.4 mi away" when location enabled

### **Maps & Navigation**
- ✅ **Google Maps integration** - Visual incident location with markers
- ✅ **RESPOND button** - One-tap navigation to Apple/Google Maps
- ✅ **Priority badges** - Color-coded overlays on map view
- ✅ **Deep-linking** - Platform-specific navigation (iOS/Android/Web)

### **Response Tracking**
- ✅ **Response logging** - Track responding/arrived/completed status
- ✅ **Live location** - Responder GPS pings every 20 seconds when responding
- ✅ **Supervisor map** - Real-time view of all active responders
- ✅ **Status management** - Long-press RESPOND for status updates

### **Communication**
- ✅ **Push notifications** - Server-driven alerts via Expo Push API
- ✅ **Incident chat** - Live messaging between employees and supervisors
- ✅ **Role-based access** - Different permissions for employee/supervisor/customer

### **Media & Documentation**
- ✅ **Photo attachments** - Upload incident photos to Firebase Storage
- ✅ **Document management** - PDF uploads with preview gallery
- ✅ **PDF library** - Centralized document access with e-sign links
- ✅ **Contact management** - Supervisor can add homeowner contact info

### **User Management**
- ✅ **Authentication** - Firebase Auth with AsyncStorage persistence
- ✅ **User profiles** - Automatic profile creation with role assignment
- ✅ **Payment integration** - Cash App/Venmo handle management
- ✅ **Favorites system** - Bookmark incidents with persistent storage

## 🎨 Design System

### **Apple-Clean UI**
- Consistent design tokens for colors, spacing, typography
- Material Design shadows and animations
- Professional color coding (red=critical, orange=high, green=success)
- Responsive layout for all screen sizes

### **Enterprise UX**
- Toast notifications for user feedback
- Loading states and error handling
- Pull-to-refresh and optimistic updates
- Keyboard-aware forms and navigation

## 🏗️ Architecture

### **Frontend Stack**
- **Expo 52** - React Native framework with managed workflow
- **Expo Router** - File-based navigation with TypeScript
- **Firebase SDK** - Real-time database, auth, storage, functions
- **TypeScript** - Full type safety across all components

### **Backend Services**
- **Firestore** - Real-time database with security rules
- **Firebase Auth** - User authentication and session management
- **Firebase Storage** - Media and document file storage
- **Cloud Functions** - Server-side geocoding and push notifications

### **Security**
- **Role-based permissions** - UI and database-level access control
- **Firestore Security Rules** - Server-enforced data protection
- **Audit trails** - Immutable response and chat logs
- **Input validation** - Client and server-side data sanitization

## 📱 Platform Support

- **iOS** - Native performance with Apple Maps integration
- **Android** - Google Maps navigation and Material Design
- **Web** - Progressive web app with responsive design
- **Development** - Hot reload and TypeScript error checking

## 🚀 Deployment

### **Development**
```bash
npm run start -- --clear  # Start Expo dev server
npx tsc --noEmit          # TypeScript check
```

### **Push Notifications**
```bash
# Get device token from Profile > Show Push Token
node tools/send-push.js ExponentPushToken[...]
```

### **Cloud Functions**
```bash
cd functions
npm install
firebase deploy --only functions
```

### **Firestore Rules**
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

## 🎯 Testing Scenarios

### **Emergency Response Workflow**
1. **Alert received** → Push notification sent to responders
2. **Incident search** → Filter by priority/proximity/type
3. **Response initiated** → Tap RESPOND, log response, open navigation
4. **Live tracking** → Location pings every 20s, visible to supervisors
5. **Status updates** → Mark arrived/completed via long-press menu
6. **Evidence collection** → Add photos, supervisor uploads documents
7. **Communication** → Chat with supervisors throughout response

### **Role-Based Testing**
- **Employee**: Can respond, upload photos, chat, view incidents
- **Supervisor**: All employee permissions + contact management, document uploads, responder tracking
- **Customer**: Read-only access to public incident information

### **Offline Testing**
- **Network disconnect** → Connection banner shows "From cache"
- **Favorites work** → AsyncStorage persistence survives app restarts
- **Push queue** → Notifications delivered when reconnected

## 📊 Analytics & Monitoring

### **Response Metrics**
- Response time tracking (alert → responding → arrived → completed)
- Location accuracy and update frequency
- Push notification delivery rates
- User engagement and feature usage

### **System Health**
- Real-time connection status monitoring
- Firebase quota usage and performance
- Error tracking and crash reporting
- Security rule violation logging

## 🔒 Security Features

### **Data Protection**
- Role-based Firestore security rules
- Encrypted authentication tokens
- Input sanitization and validation
- Audit logs for all critical actions

### **Privacy Controls**
- Location access only when responding
- Push token management per device
- User profile data ownership
- Optional payment handle storage

## 🌟 Enterprise Readiness

This system is production-ready for:
- **Campus Safety Departments** - University emergency response
- **Fire Departments** - Incident coordination and response tracking  
- **Security Companies** - Real-time incident management
- **Emergency Services** - Multi-agency coordination and communication

**Key Enterprise Benefits:**
- Reduces response time through intelligent filtering and mapping
- Provides accountability through comprehensive response logging
- Enables real-time coordination between field and supervision
- Offers evidence collection and documentation capabilities
- Supports role-based access for different user types

---

*Built with ❤️ for campus safety and emergency response teams*