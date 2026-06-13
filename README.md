# Rewire

Rewire is a React Native recovery companion for tracking freedom from weed and nicotine. The current app is primarily a polished UI/UX prototype: it has the core screens, visual system, dashboard cards, analytics surfaces, privacy controls, and backup affordances, but most product logic is still mocked or local component state.

The goal from here is to turn the interface into an offline-first, privacy-respecting mobile app that can be shipped through the Apple App Store and Google Play Store.

## Current App Status

### What already exists

- Bare React Native app using React Native `0.86.0`, React `19.2.3`, TypeScript, Hermes, Jest, and React Native CLI.
- Native iOS and Android projects are present under `ios/` and `android/`.
- Three main app sections:
  - `Dashboard`: substance selector, live streak timer, savings and health cards, SOS craving modal.
  - `Analytics`: consistency calendar, trigger distribution, relapse/reflection ledger.
  - `Settings`: financial profile settings, privacy/security toggles, backup/import/export UI.
- Custom dark visual system with weed and nicotine accent themes.
- A simple floating tab bar in `App.tsx`.
- Basic render test in `__tests__/App.test.tsx`.

### What is still mocked or incomplete

- No persistent storage is wired in.
- Quit dates, streaks, relapse history, savings, calendar data, health metrics, and trigger analytics are static mock data.
- SOS craving logs are not saved.
- Settings callbacks currently log to the console or return mock promises.
- Biometric authentication is simulated, not connected to Face ID, Touch ID, or Android biometrics.
- Backup import uses a mock payload instead of a real document picker and schema validator.
- The app uses local tab state instead of a full navigation stack.
- There is no onboarding flow, no first-run setup, no release signing, and no store-ready metadata.

## Project Structure

```txt
.
├── App.tsx                         # App shell and floating tab state
├── index.js                        # React Native entry point
├── app.json                        # RN app name/display name
├── screens/
│   ├── Dashboard.tsx               # Main recovery overview
│   ├── Analytics.tsx               # Calendar, trigger, relapse insights
│   └── Settings.tsx                # Profile, privacy, backup controls
├── components/
│   ├── SubstanceToggle.tsx         # Weed/nicotine selector
│   ├── HeroCounter.tsx             # Live streak counter, currently mock date based
│   ├── QuickStats.tsx              # Savings and health metrics, currently static
│   ├── PanicButton.tsx             # SOS craving modal, currently not persisted
│   ├── StreakCalender.tsx          # Calendar grid, currently mock June 2026 data
│   ├── TriggerBreakdown.tsx        # Trigger distribution, currently mock data
│   ├── RelapseLedger.tsx           # Slip/reflection timeline, currently mock data
│   ├── ProfileConfigs.tsx          # Currency and daily budget inputs
│   ├── PrivacySecurity.tsx         # Privacy toggles, currently simulated
│   └── DataBackup.tsx              # Backup UI, currently mock import/export flow
├── ios/                            # iOS native project
├── android/                        # Android native project
└── __tests__/App.test.tsx          # Smoke render test
```

Note: `StreakCalender.tsx` is misspelled in the filename and imports. Rename it to `StreakCalendar.tsx` once you are ready to touch imports.

## Local Development

### Requirements

- Node.js `>= 22.11.0`
- npm or Yarn
- Xcode for iOS builds
- Android Studio and Android SDK for Android builds
- CocoaPods for iOS dependencies

### Install dependencies

```sh
npm install
```

For iOS:

```sh
bundle install
bundle exec pod install --project-directory=ios
```

### Run Metro

```sh
npm start
```

### Run the app

```sh
npm run ios
npm run android
```

### Tests and linting

```sh
npm test
npm run lint
```

## Production Roadmap

The shortest path to a deployable app is to build the local product engine first, then harden native release settings, privacy, and store compliance.

### 1. Define the real data model

Create typed domain models before wiring UI logic. Suggested entities:

- `UserSettings`: currency, daily weed spend, daily nicotine spend, biometric lock enabled, app-switcher masking enabled.
- `SubstanceProfile`: substance type, quit date, active streak state, daily cost baseline.
- `CravingLog`: substance, timestamp, intensity, trigger, outcome, optional note.
- `RelapseLog`: substance, timestamp, streak lost, trigger, reflection note.
- `DailyStatus`: date, substance, clean/craving defeated/relapse/no data.
- `BackupPayload`: schema version, exported timestamp, settings, profiles, logs.

Add runtime validation for imported backup data so malformed files cannot corrupt local state.

### 2. Add offline-first persistence

The UI comments already point toward Zustand and MMKV. A good first production setup would be:

- Zustand for app state and selectors.
- `react-native-mmkv` for fast local persistence.
- Keychain/Keystore storage for sensitive flags or encryption keys.
- Versioned migrations for future schema changes.
- A single storage service layer so components never write directly to raw storage.

After this, connect:

- `HeroCounter` to real quit dates.
- `QuickStats` to real daily spend settings and streak duration.
- `PanicButton` to real craving logs.
- `StreakCalendar` to actual daily status data.
- `TriggerBreakdown` to aggregate craving logs.
- `RelapseLedger` to real relapse/reflection entries.
- `ProfileConfigs`, `PrivacySecurity`, and `DataBackup` to the store.

### 3. Build onboarding and first-run setup

Before users can see meaningful data, the app needs an onboarding flow:

- Pick tracked substances: weed, nicotine, or both.
- Enter quit date or start today.
- Enter daily spend baseline and currency.
- Set privacy preference: biometric lock, app-switcher masking.
- Explain that the app is local/offline-first.
- Provide a clear disclaimer that this is a self-tracking support tool, not medical care.

### 4. Replace the temporary navigation shell

`App.tsx` currently keeps all screens mounted and switches them with local state. For production:

- Use React Navigation properly with a bottom tab navigator.
- Add stack routes for onboarding, edit profile, craving details, relapse reflection, backup restore review, and privacy lock screen.
- Preserve safe area behavior and avoid content being hidden behind the floating nav.
- Add deep-link handling only if a real use case exists.

### 5. Implement SOS and relapse workflows

The strongest product loop is the craving intervention flow. It should save real data and feel reliable offline:

- Save craving intensity, trigger, timestamp, substance, and outcome.
- Add optional notes after the user calms down.
- Add relapse logging separately from "I beat the craving."
- Reset or adjust streaks based on relapse policy.
- Let users edit or delete mistaken logs.
- Add a history detail view for reflections.

### 6. Make analytics real

Replace all mock analytics with derived selectors:

- Current streak duration.
- Longest streak.
- Money saved by substance and total.
- Clean days per month.
- Craving frequency by time of day.
- Top triggers.
- Relapse/slip trend.
- Calendar generation based on the actual month and locale.

Be careful with health claims. The current health copy is specific and may need medical review or softer language before release.

### 7. Privacy and security implementation

The app promises privacy, so the implementation must match the copy:

- Wire Face ID/Touch ID and Android biometric authentication.
- Add app lock on launch and when returning from background.
- Implement app-switcher masking with native blur/cover views.
- Decide whether local data is plain MMKV or encrypted MMKV.
- Remove or justify `android.permission.INTERNET` if the app is truly offline-only.
- Remove the empty iOS location usage string unless location is actually needed.
- Keep `PrivacyInfo.xcprivacy` aligned with the native APIs and third-party SDKs you ship.
- Do not add analytics/crash tools until the privacy policy and App Store privacy labels reflect them.

### 8. Backup and restore

The backup UI needs real file handling:

- Export a `.json` file through the native share sheet or document picker.
- Import a selected `.json` file using a document picker.
- Validate schema version and required fields before restore.
- Show a restore preview before overwriting local data.
- Support migrations for older backup versions.
- Add tests around import validation and destructive overwrite behavior.

### 9. Native release readiness

Fix these before store submission:

- iOS bundle identifier is still the default pattern: `org.reactjs.native.example...`.
- Android application id is `com.rewire`; confirm this is final and available.
- Android release currently signs with the debug keystore. Generate and configure a real release keystore.
- Android ProGuard/minification is disabled. Decide whether to enable it and test release builds.
- App display name is lowercase `rewire`; choose final branding.
- Launcher icons are default React Native assets. Replace app icons for all iOS and Android sizes.
- Create a proper launch screen.
- Set versioning policy for `MARKETING_VERSION`, `CURRENT_PROJECT_VERSION`, `versionName`, and `versionCode`.
- Test real release builds on physical iOS and Android devices.

### 10. Store compliance and product policy

For App Store and Play Store review, prepare:

- Privacy policy URL.
- Support URL/email.
- App Store screenshots for required device sizes.
- Google Play screenshots, feature graphic, short description, full description.
- Age rating questionnaire.
- Health/wellness disclaimers.
- Data safety form.
- App privacy labels.
- Export compliance answers.
- Clear explanation of local-only data storage.

Because the app touches substance recovery, avoid language that implies guaranteed medical outcomes. Position the product as habit tracking, self-reflection, and craving support.

### 11. Testing plan

Minimum production test coverage:

- Unit tests for streak duration calculations.
- Unit tests for savings calculations.
- Unit tests for calendar status mapping.
- Unit tests for trigger aggregation.
- Unit tests for backup export/import validation.
- Component tests for Dashboard, Analytics, Settings, and SOS modal states.
- Manual QA on small iPhones, large iPhones, Android compact devices, and Android large devices.
- Release build smoke tests for iOS and Android.

Nice-to-have:

- Detox or Maestro end-to-end tests for onboarding, craving log, relapse log, backup export, and app lock.
- Snapshot or visual regression tests for dense UI screens.

### 12. Code cleanup before scaling

- Remove placeholder citation strings such as `[cite: 20]` from visible UI text and comments.
- Replace console logs with a real debug/logger strategy.
- Move mock data into fixtures while logic is being built, then remove it.
- Extract shared colors, spacing, typography, and card styles into a theme module.
- Avoid hard-coded dates like June 2026 in production components.
- Audit emoji usage in UI for accessibility and platform consistency.
- Add accessibility labels, roles, and Dynamic Type checks.
- Add error and empty states for every real workflow.

## Suggested Implementation Order

1. Create domain types, calculation utilities, and fixture tests.
2. Add Zustand store and MMKV persistence.
3. Wire settings, quit dates, streak counter, and savings calculations.
4. Implement onboarding and first-run setup.
5. Persist SOS craving logs and relapse logs.
6. Replace mock analytics with selectors derived from local logs.
7. Implement biometric lock and app-switcher masking.
8. Implement real backup export/import with schema validation.
9. Replace local tab switching with React Navigation tabs/stacks.
10. Add release signing, app icons, bundle IDs, privacy files, and store metadata.
11. Run release QA and submit TestFlight/internal testing builds.

## Known Production Blockers

- No real data persistence.
- No onboarding or user setup.
- Mock health, analytics, streak, relapse, and backup data.
- Simulated biometric authentication.
- Android release uses debug signing.
- iOS bundle identifier is still the React Native default.
- App icons and launch branding are still default/minimal.
- Empty iOS location permission string should be removed or completed.
- Store privacy policy, data safety answers, screenshots, and support links are not prepared.

## Scripts

```sh
npm start        # Start Metro
npm run ios      # Build and run iOS
npm run android  # Build and run Android
npm test         # Run Jest
npm run lint     # Run ESLint
```
