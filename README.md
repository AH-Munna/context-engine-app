# Context Engine Mobile App

React Native starter application for **Context Engine**, built with TypeScript, React Native 0.78, and `pnpm`.

---

## Features & Highlights

- **Clean Starter Architecture**: Minimal, clutter-free starting screen with brand theme integration.
- **Design System Tokens**: Tailored colors and typography aligned with Context Engine web platform:
  - Primary: `#0069D4` (Context Engine Blue)
  - Secondary: `#009A86` (Teal)
  - Typography: 100% Inter font family
  - Neutral / Surfaces: Slate light (`#FAFCFE`), Slate-900 (`#030609`), Dark Surface (`#0B0F19`)
- **Extensive UI Component Library**: 25+ production-ready, reusable UI components and showcases accessible directly from the starter screen (Buttons, Cards, Modals, Pickers, Bottom Sheets, Accordions, Tabs, Charts, and more).
- **Decoupled State & Services**: Clean Redux Toolkit store and lightweight Axios HTTP service client.
- **Modern Package Management**: Full `pnpm` workspace support (`node-linker=hoisted`).

---

## Project Structure

```
context-engine-app/
├── app/
│   ├── assets/               # Images and icons
│   ├── components/           # Generic reusable UI primitives (Buttons, Inputs, Cards, etc.)
│   ├── constants/            # Theme tokens, ThemeContext, and Colors
│   ├── layout/               # App layout & headers
│   ├── Navigations/          # React Navigation stack & routes
│   ├── Redux/                # Store and appSlice
│   ├── Screens/
│   │   ├── Home.tsx          # Minimal starter home screen
│   │   ├── Components.tsx    # UI showcase directory
│   │   └── Components/       # 25 interactive component showcase screens
│   ├── Service/              # API HTTP client
│   └── types/                # Core TypeScript definitions
├── android/                  # Android native project (com.contextengine.app)
├── ios/                      # iOS native project
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js**: >= 18
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Android Development**:
  - JDK 17 (`sudo apt install openjdk-17-jdk` on Ubuntu)
  - Android Studio & Android SDK (`ANDROID_HOME` configured)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start the Metro Bundler

```bash
pnpm start
```

### 3. Run the App

#### Android
```bash
pnpm android
```

#### iOS (macOS only)
```bash
cd ios && pod install && cd ..
pnpm ios
```

---

## Quality Checks

- **Typecheck**: `pnpm tsc --noEmit`
- **Bundle Check (Android)**: `pnpm react-native bundle --platform android --dev false --entry-file index.js --bundle-output /dev/null`
- **Bundle Check (iOS)**: `pnpm react-native bundle --platform ios --dev false --entry-file index.js --bundle-output /dev/null`
