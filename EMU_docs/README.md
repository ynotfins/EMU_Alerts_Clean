# EMU Alerts - Emergency Management & Unified Response System

<div align="center">

![EMU Alerts Logo](../assets/icon.png)

**Advanced Emergency Management Platform for Eastern Michigan University**

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2054-000020.svg?style=flat-square&logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-61DAFB.svg?style=flat-square&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.14.1-FFCA28.svg?style=flat-square&logo=firebase)](https://firebase.google.com/)

**Platform Support:** iOS • Android • Web

</div>

## 📱 Overview

EMU Alerts is a comprehensive emergency management and unified response system designed for Eastern Michigan University. The application provides real-time emergency notifications, incident tracking, case management, and communication tools for campus safety and emergency response teams.

### 🎯 Mission
To provide a reliable, fast, and comprehensive emergency management platform that ensures effective communication and coordination during critical situations on campus.

## ✨ Features

### 🚨 **Emergency Management**
- **Real-time Incident Feed** - Live updates from multiple alert sources with automatic deduplication
- **Priority-based Alerts** - Critical, high, medium, and low priority classification
- **Geographic Targeting** - Location-based alert distribution and mapping
- **Multi-channel Notifications** - Push notifications, SMS, email integration
- **Emergency Response Workflow** - Structured response procedures and status tracking

### 🗺️ **Location & Navigation**
- **Interactive Maps** - Google Maps integration with incident markers
- **Turn-by-turn Navigation** - Deep-link integration with native map applications
- **Geocoding Services** - Automatic address-to-coordinates conversion
- **Distance Calculations** - Real-time distance to incidents for responders
- **Presence Tracking** - Live location tracking for active field responders

### 💼 **Case Management (CRM)**
- **Automated Case Creation** - Every alert/incident automatically generates a case
- **Task Management** - Assign and track tasks related to incidents
- **Notes System** - Collaborative note-taking for incident documentation
- **Document Management** - File uploads, PDF storage, and document organization
- **Timeline Tracking** - Complete audit trail of all case activities
- **Status Management** - Case lifecycle management with status workflows

### 👥 **Role-Based Access Control**
- **Employee Access** - Field operations, note creation, task updates
- **Supervisor Controls** - Case management, team oversight, administrative functions
- **Customer Portal** - Read-only access for stakeholders (planned)
- **Granular Permissions** - Firestore security rules enforce role-based data access

### 💬 **Communication**
- **Real-time Chat** - Per-incident chat channels for coordination
- **Role Identification** - Messages labeled by user role and department
- **Push Notifications** - Instant notification delivery for critical updates
- **Supervisor Alerts** - Automated notifications for response activities

### 📋 **Supervisor Tools**
- **Live Responder Map** - Real-time view of all active field personnel
- **Response Analytics** - Performance metrics and response time tracking
- **Team Management** - Oversight of employee activities and case assignments
- **Incident Oversight** - Complete visibility into all active incidents

### 📄 **Document Management**
- **File Uploads** - Support for photos, PDFs, and documents
- **E-signature Integration** - Dropbox Sign integration for digital signatures
- **Document Library** - Centralized storage and organization
- **Case Documentation** - Attach documents directly to specific cases

### 🔔 **Advanced Notifications**
- **Device Token Management** - Automatic registration and token storage
- **Targeted Messaging** - Role-based and location-based notification targeting
- **Delivery Tracking** - Monitor notification delivery status and failures
- **Test Notifications** - Built-in tools for testing notification systems

## 🛠️ Technology Stack

### **Frontend**
```json
{
  "platform": "Expo React Native (SDK 54)",
  "language": "TypeScript 5.9.2",
  "ui_framework": "React Native 0.81.4",
  "navigation": "Expo Router 6.0.6",
  "state_management": "React Hooks + Context",
  "maps": "React Native Maps 1.20.1",
  "notifications": "Expo Notifications 0.32.11"
}
```

### **Backend**
```json
{
  "database": "Firebase Firestore (NoSQL)",
  "authentication": "Firebase Authentication",
  "functions": "Firebase Cloud Functions (Node.js)",
  "storage": "Firebase Storage",
  "real_time": "Firestore Real-time Listeners",
  "push_notifications": "Expo Push Notification Service"
}
```

### **External Services**
```json
{
  "mapping": "Google Maps API (Geocoding + Maps SDK)",
  "e_signatures": "Dropbox Sign (Embedded)",
  "payments": "Cash App + Venmo Deep-linking"
}
```

## 🏗️ Architecture

### **High-Level Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Firebase      │    │   External      │
│                 │    │   Backend       │    │   Services      │
│  • iOS/Android  │◄──►│                 │◄──►│                 │
│  • Web App      │    │ • Firestore     │    │ • Google Maps   │
│  • TypeScript   │    │ • Auth          │    │ • Dropbox Sign  │
│                 │    │ • Functions     │    │ • Push Service  │
└─────────────────┘    │ • Storage       │    └─────────────────┘
                       └─────────────────┘
```

### **Data Architecture**
- **Incidents & Alerts** - Dual-source feed with client-side deduplication
- **Cases** - 1:1 mapping with incidents, complete CRM functionality
- **Users** - Role-based profiles with presence tracking
- **Real-time Sync** - Firestore listeners for live updates
- **Offline Support** - Client-side caching with automatic sync

### **Security Model**
- **Firebase Authentication** - Secure user authentication
- **Firestore Security Rules** - Role-based data access control
- **Admin SDK** - Server-side operations bypass client rules
- **Token Management** - Secure device token storage and rotation

## 📂 Project Structure

```
EMU_Alerts_Clean/
├── app/                          # Expo Router screens
│   ├── (auth)/                   # Authentication screens
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── index.tsx            # Incidents feed
│   │   ├── cases.tsx            # CRM case management
│   │   ├── chat.tsx             # Communication hub
│   │   ├── documents.tsx        # Document library
│   │   ├── favorites.tsx        # Saved incidents
│   │   ├── profile.tsx          # User profile
│   │   └── supervise.tsx        # Supervisor tools
│   ├── case/[id].tsx            # Individual case details
│   ├── chat/[id].tsx            # Incident-specific chat
│   └── incident/[id].tsx        # Incident details
├── components/                   # Reusable UI components
├── hooks/                       # Custom React hooks
├── functions/                   # Firebase Cloud Functions
├── firestore.rules             # Database security rules
├── firebase.config.ts          # Firebase configuration
├── app.config.ts              # Expo configuration
└── EMU_docs/                  # Project documentation
```

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+
- Expo CLI
- Firebase project with Firestore, Auth, Storage enabled
- Google Maps API key
- Development device or simulator

### **Installation**
```bash
# Clone the repository
git clone https://github.com/ynotfins/EMU_Alerts_Clean.git
cd EMU_Alerts_Clean

# Install dependencies
npm install

# Start development server
npm run start

# Run on specific platforms
npm run ios     # iOS Simulator
npm run android # Android Emulator  
npm run web     # Web Browser
```

### **Environment Configuration**
Create `.env` file in project root:
```env
EXPO_PUBLIC_APP_NAME=EMU Alerts
EXPO_PUBLIC_APP_SLUG=emu-alerts
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### **Firebase Setup**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and deploy functions
firebase login
firebase deploy --only functions

# Configure function secrets
firebase functions:config:set sign.api_key="dropbox_sign_key"
```

## 📱 User Roles & Workflows

### **Employee Workflow**
1. **Login** - Secure authentication with role verification
2. **View Incidents** - Browse real-time incident feed with priority filtering
3. **Respond to Incidents** - Mark response status and provide ETA
4. **Navigate to Location** - Use integrated maps for turn-by-turn directions
5. **Communicate** - Real-time chat with supervisors and team members
6. **Document Activities** - Add notes, upload photos, complete tasks
7. **Update Status** - Report arrival, progress, and completion

### **Supervisor Workflow**
1. **Monitor Operations** - Live dashboard of all active incidents and responses
2. **Track Personnel** - Real-time map showing locations of all field responders
3. **Manage Cases** - Complete CRM functionality for incident lifecycle management
4. **Coordinate Response** - Assign tasks, manage resources, oversee operations
5. **Generate Reports** - Access analytics and performance metrics
6. **Handle Documentation** - Manage case files, e-signatures, and official records

## 🔧 Development Commands

```bash
# Development
npm run start          # Start Expo dev server
npm run web           # Start web development
npm run typecheck     # TypeScript type checking
npm run test          # Run test suite
npm run lint          # Code linting

# Expo Tools
npx expo doctor       # Check project health
npx expo login        # Login to Expo account
npx expo build        # Build for production

# Firebase
firebase deploy --only functions    # Deploy Cloud Functions
firebase emulators:start            # Start local emulators
```

## 📊 Current Status

**Development Phase:** Advanced Enterprise Development (75% Complete)
**Platform Support:** iOS, Android, Web
**Backend Status:** Fully operational Firebase infrastructure
**Testing Status:** Manual testing, automated testing in development
**Deployment:** Development environment active

### **Implemented Features**
✅ Core mobile application with tab navigation  
✅ Real-time incident tracking and management  
✅ Firebase authentication and role-based access  
✅ CRM case management system  
✅ Live chat functionality  
✅ Document management and file uploads  
✅ Push notification infrastructure  
✅ Location services and mapping  
✅ Supervisor oversight tools  
✅ Cloud Functions for server-side logic  

### **Upcoming Features**
🔄 Enhanced analytics and reporting dashboard  
🔄 Advanced notification targeting and campaigns  
🔄 Offline action queue for disconnected operation  
🔄 Customer portal for stakeholder access  
🔄 Multi-agency coordination features  

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes and commit (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is proprietary software developed for Eastern Michigan University emergency management operations.

## 🆘 Support

For technical support or feature requests:
- Create an issue in the GitHub repository
- Contact the EMU IT Support team
- Review documentation in `/EMU_docs/` folder

---

<div align="center">

**Built with ❤️ for Eastern Michigan University Campus Safety**

*Ensuring rapid response and effective communication during critical situations*

</div>
