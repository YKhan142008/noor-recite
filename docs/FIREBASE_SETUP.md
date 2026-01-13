# Firebase Setup Guide

## Step 1: Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **noor-recite**
3. Click the gear icon ⚙️ → **Project settings**
4. Scroll down to "Your apps" section
5. If you don't have a web app, click "Add app" → Web (</>) icon
6. Copy the `firebaseConfig` object

## Step 2: Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
cp env.example .env.local
```

Then fill in your Firebase credentials from Step 1:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=noor-recite.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=noor-recite
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=noor-recite.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Step 3: Get Firebase Admin Service Account

For the migration script, you need a service account key:

1. In Firebase Console → Project settings
2. Go to **Service accounts** tab
3. Click **Generate new private key**
4. Save the JSON file as `firebase-service-account.json` in project root
5. **IMPORTANT**: This file is gitignored for security

## Step 4: Enable Firestore

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (we'll set rules later)
4. Select your preferred location (closest to your users)

## Step 5: Install Firebase Admin SDK

```bash
npm install firebase-admin
```

## Step 6: Run the Migration

```bash
npx ts-node scripts/migrate-tafsir.ts
```

This will:
- Read the 14MB tafsir JSON file
- Upload it to Firestore in batches of 500
- Create ~6,236 documents in the `tafsir` collection
- Take approximately 2-3 minutes

## Step 7: Verify Migration

Check your Firestore console to see the `tafsir` collection populated with documents.

## Firestore Security Rules

After migration, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tafsir is read-only for all users
    match /tafsir/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    
    // User data is private to each user
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User activity is private
    match /user_activity/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Troubleshooting

**Error: "Cannot find module 'firebase-admin'"**
- Run: `npm install firebase-admin`

**Error: "Service account file not found"**
- Make sure `firebase-service-account.json` is in the project root
- Check the file path in `migrate-tafsir.ts`

**Error: "Permission denied"**
- Verify your service account has Firestore write permissions
- Check that Firestore is enabled in your project

## Next Steps

After successful migration:
1. Test the tafsir service with `getTafsirByVerse('1:1')`
2. Update UI components to use the new service
3. Remove the local JSON file to save space
