import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "EMU Alerts",
  slug: "emu-alerts",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: process.env.IOS_BUNDLE_ID || "com.emu.alerts"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: process.env.ANDROID_PACKAGE || "com.emu.alerts",
    googleServicesFile: "./credentials/google-services.json"
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins: [
    "expo-router",
    [
      "expo-notifications",
      {
        icon: "./assets/icon.png",
        color: "#ffffff",
        defaultChannel: "default"
      }
    ],
    "@react-native-firebase/app"
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID
    }
  }
});