/** @type {import('@expo/config').ExpoConfig} */
import { readFileSync } from 'fs';

function readIOSBundleIdFromPlist() {
  try {
    const plist = readFileSync('./credentials/GoogleService-Info.plist', 'utf8');
    const m = plist.match(/<key>BUNDLE_ID<\/key>\s*<string>([^<]+)<\/string>/);
    return m ? m[1] : 'com.emualerts.ios';
  } catch {
    return 'com.emualerts.ios';
  }
}

export default ({ config }) => ({
  expo: {
    name: process.env.EXPO_PUBLIC_APP_NAME ?? "EMU Alerts",
    slug: process.env.EXPO_PUBLIC_APP_SLUG ?? "emualerts",
    scheme: "emualerts",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    plugins: [
      ["expo-notifications"]
      // TODO: Add react-native-maps plugin once compatibility is resolved for SDK 54
      // [
      //   "react-native-maps", 
      //   { config: { googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY } }
      // ]
    ],
    ios: {
      bundleIdentifier: readIOSBundleIdFromPlist(),
      supportsTablet: true,
      googleServicesFile: "./credentials/GoogleService-Info.plist"
    },
    android: {
      package: "com.emualerts",
      googleServicesFile: "./credentials/google-services.json",
      permissions: [
        "WAKE_LOCK","VIBRATE","POST_NOTIFICATIONS",
        "ACCESS_FINE_LOCATION","ACCESS_COARSE_LOCATION"
      ]
    },
    web: { bundler: "metro", favicon: "./assets/favicon.png" },
    notification: { iosDisplayInForeground: true },
    experiments: { typedRoutes: true },
    updates: { fallbackToCacheTimeout: 0 },
    extra: {
      eas: {
        projectId: "b40c82be-f4b7-4f9a-8fa1-b0126cb45366"
      }
    }
  }
});