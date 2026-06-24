# Building the Folio APK

The Folio mobile app ships as an Android APK via **EAS Build** (Expo's cloud
build). This needs your Expo account (a free login the assistant can't perform
for you).

## One-time

```bash
cd apps/mobile
npx eas-cli login          # your Expo account
npx eas-cli init           # creates the EAS project, writes projectId to app.json
```

## Build an APK (internal distribution)

```bash
# Demo APK (runs against the live API in demo mode — no sign-in):
npx eas-cli build -p android --profile preview

# Live APK (real auth): set the Clerk key for the build first, then build:
#   add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to the "preview" env in eas.json
npx eas-cli build -p android --profile preview
```

EAS returns a URL to download the `.apk` when the build finishes (~10-15 min).
Install it on any Android device (enable "install from unknown sources").

## Run locally without building

```bash
npx expo start            # press "a" (Android), "i" (iOS), or "w" (web)
```

## Environment

Copy `.env.example` → `.env` and fill `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` to
enable real auth locally. `EXPO_PUBLIC_API_URL` defaults to the deployed API.
