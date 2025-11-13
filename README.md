# HabitTracker

A beautiful, guilt-free habit tracking mobile application built with React Native and Expo. Track your journey by logging cravings, positive thoughts, and bumps in the road with an intuitive, supportive interface.

## Features

### 🎯 Core Functionality
- **Journal Entries**: Log three types of entries:
  - **Cravings**: Track moments when you experience cravings
  - **Positive Thoughts**: Record positive thoughts and feelings
  - **Bumps in the Road**: Document setbacks without judgment

### 📱 Key Screens
- **Onboarding Flow**: Welcome screen and habit name setup
- **Home Screen**: 
  - Weekly calendar view showing entries as color-coded bubbles
  - Days since last bump counter
  - Quick access buttons for logging entries
- **Calendar View**: Monthly calendar showing the last 12 months of entries
- **History Screen**: Chronological list of all entries grouped by date
- **Journal Screen**: Dedicated entry screen for each entry type

### 🎨 Design Features
- Dark theme with modern UI
- Color-coded entry types:
  - 🟡 Cravings (Amber)
  - 🟢 Positive (Green)
  - 🔴 Bumps (Red)
- Smooth animations and haptic feedback
- Responsive layout for iOS, Android, and Web

## Tech Stack

- **Framework**: [Expo](https://expo.dev) ~54.0.22
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) ~6.0.14 (file-based routing)
- **UI**: React Native 0.81.5
- **Storage**: AsyncStorage for local data persistence
- **Navigation**: React Navigation
- **Styling**: StyleSheet with themed components
- **Language**: TypeScript

## Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- Expo CLI (installed globally or via npx)
- iOS Simulator (for Mac) or Android Emulator, or Expo Go app on your device

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd HabitTracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Getting Started

1. Start the Expo development server:
   ```bash
   npm start
   # or
   npx expo start
   ```

2. Choose your platform:
   - Press `i` to open iOS simulator
   - Press `a` to open Android emulator
   - Press `w` to open in web browser
   - Scan QR code with Expo Go app on your device

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start on Android emulator
- `npm run ios` - Start on iOS simulator
- `npm run web` - Start in web browser
- `npm run lint` - Run ESLint

## Project Structure

```
HabitTracker/
├── app/                    # File-based routing (Expo Router)
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Entry point
│   ├── home.tsx           # Main home screen
│   ├── history.tsx        # History view
│   ├── calendar/          # Calendar screens
│   │   ├── index.tsx     # Monthly calendar
│   │   └── [date].tsx    # Date detail view
│   ├── journal/           # Journal entry screens
│   │   └── [type].tsx    # Entry type screen
│   └── onboarding/       # Onboarding flow
│       ├── index.tsx     # Welcome screen
│       └── name.tsx      # Name setup
├── components/            # Reusable components
│   ├── themed-text.tsx   # Themed text component
│   ├── themed-view.tsx   # Themed view component
│   └── ui/               # UI components
├── constants/             # App constants
│   └── theme.ts          # Theme configuration
├── hooks/                 # Custom React hooks
└── assets/               # Images and static assets
```

## Data Storage

The app uses `AsyncStorage` to persist data locally on the device:
- `habit:name` - Stores the user's habit name
- `log:entries` - Stores all journal entries as JSON

Entries are stored with the following structure:
```typescript
{
  id: string;
  type: 'craving' | 'positive' | 'bump';
  timestamp: number;
  note?: string;
}
```

## Development

### File-based Routing
This project uses Expo Router for navigation. Routes are automatically generated based on the file structure in the `app/` directory.

### Theming
The app uses a custom theming system with `ThemedText` and `ThemedView` components that adapt to light/dark mode.

### Adding New Features
1. Create new screens in the `app/` directory
2. Add routes in `app/_layout.tsx` if needed
3. Use AsyncStorage for data persistence
4. Follow existing component patterns for consistency

## Building for Production

To create a production build:

```bash
# For iOS
npx expo build:ios

# For Android
npx expo build:android
```

Or use EAS Build (recommended):
```bash
npm install -g eas-cli
eas build --platform ios
eas build --platform android
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and not licensed for public use.

## Acknowledgments

Built with [Expo](https://expo.dev) and the React Native community.
