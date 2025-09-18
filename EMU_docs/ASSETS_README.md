# Assets Directory

This directory contains all the visual assets for the EMU Alerts app.

## Required Files

The following files need to be added to make the app fully functional:

### Icons
- `icon.png` - Main app icon (1024x1024px)
- `adaptive-icon.png` - Android adaptive icon (1024x1024px)
- `favicon.png` - Web favicon (48x48px)
- `splash-icon.png` - Splash screen icon (512x512px)

### Image Requirements

#### App Icon (icon.png)
- Size: 1024x1024 pixels
- Format: PNG with transparency
- Content: EMU shield/safety logo
- Background: Transparent or solid color

#### Adaptive Icon (adaptive-icon.png)
- Size: 1024x1024 pixels
- Format: PNG
- Content: Centered EMU logo within safe area (660x660px center)
- Background: Should work on any color background

#### Favicon (favicon.png)
- Size: 48x48 pixels
- Format: PNG
- Content: Simplified EMU logo
- High contrast for visibility in browser tabs

#### Splash Icon (splash-icon.png)
- Size: 512x512 pixels
- Format: PNG
- Content: EMU logo/shield
- Will be displayed on white background during app loading

## Design Guidelines

### Colors
- Primary Red: #ef4444 (Emergency red)
- Dark Gray: #1f2937 (Headers/navigation)
- Light Gray: #f9fafb (Background)

### Style
- Modern, clean design
- High contrast for accessibility
- Professional emergency services aesthetic
- Clear visibility at all sizes

## Placeholder Assets

Until proper assets are created, you can use simple colored squares or find appropriate icons from:
- Expo Icons (already included)
- Free icon libraries
- EMU brand guidelines (if available)

## Usage in App

These assets are referenced in:
- `app.config.ts` - App configuration
- Native builds for iOS and Android
- Web builds and PWA manifest
