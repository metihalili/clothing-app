# Clothing COD Demo App

A clean Expo + React Native TypeScript demo for a clothing store with **Cash on Delivery** checkout.

## Included

- Home screen with clothing products
- Product details screen
- Size picker
- Add to cart
- Cart management
- Checkout form
- Cash on Delivery flow
- Demo orders screen (simple admin-style preview)
- Clean folder structure for expanding later

## Tech

This project is structured as an Expo app. Expo's official docs say `create-expo-app` is the standard way to initialize Expo projects, and as of March 2026 the docs note that `create-expo-app@latest` without a template creates an SDK 54 project during the SDK 55 transition, while `--template default@sdk-55` opts into SDK 55. citeturn423601search0turn423601search5

## Run locally

1. Extract the zip
2. Open the folder in VS Code
3. Install packages:

```bash
npm install
```

4. Start the app:

```bash
npx expo start
```

Then scan the QR code with Expo Go or run Android/iOS from the terminal.

## Suggested next upgrades

- Connect products and orders to Supabase
- Add authentication for admin
- Add product search and filters
- Add image upload
- Add real navigation with Expo Router or React Navigation
- Add order status updates
- Add favorites / wishlist

## Folder structure

```text
clothing-cod-demo/
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
└── src/
    ├── components/
    ├── context/
    ├── data/
    ├── navigation/
    ├── screens/
    ├── theme/
    ├── types/
    └── utils/
```

## Notes

- This is a **demo version** with local in-memory state.
- Orders are not saved permanently yet.
- Product images use remote image URLs for demo purposes.
# clothing-app
