# Phase 1: Tafsir Migration - Quick Start

## ✅ What's Been Done

1. **Firebase Configuration** (`src/lib/firebase.ts`)
   - Firestore and Auth initialization
   - Environment variable setup

2. **Migration Script** (`scripts/migrate-tafsir.ts`)
   - Batch upload of 14MB tafsir JSON to Firestore
   - ~6,236 documents will be created

3. **Tafsir Service** (`src/lib/tafsir-service.ts`)
   - Client-side caching for performance
   - Functions: `getTafsirByVerse()`, `getTafsirBySurah()`, `prefetchSurahTafsir()`

4. **Firebase Admin SDK** - Installed ✓

## 🚀 Next Steps (5-10 minutes)

### 1. Set Up Firebase Credentials

Follow the guide: `docs/FIREBASE_SETUP.md`

**Quick version:**
```bash
# Copy the example file
cp env.example .env.local

# Edit .env.local with your Firebase credentials
# Get them from: https://console.firebase.google.com/project/YOUR_PROJECT/settings/general
```

### 2. Get Service Account Key

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save as `firebase-service-account.json` in project root

### 3. Enable Firestore

1. Firebase Console → Firestore Database
2. Click "Create database"
3. Choose "Production mode"
4. Select your region

### 4. Run Migration

```bash
npm run migrate:tafsir
```

This will take 2-3 minutes and upload all tafsir data to Firestore.

### 5. Update Firestore Rules

In Firebase Console → Firestore → Rules, paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tafsir/{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## 📊 Expected Results

- **Collection**: `tafsir`
- **Documents**: ~6,236
- **Storage**: ~14 MB
- **Cost**: $0 (well within free tier)

## 🧪 Testing

After migration, test in your app:

```typescript
import { getTafsirByVerse } from '@/lib/tafsir-service';

const tafsir = await getTafsirByVerse('1:1');
console.log(tafsir?.text);
```

## ⚠️ Important Notes

- `firebase-service-account.json` is gitignored for security
- `.env.local` is gitignored - never commit credentials
- Migration is idempotent (safe to run multiple times)
- Tafsir data is read-only in Firestore

## 🐛 Troubleshooting

See `docs/FIREBASE_SETUP.md` for detailed troubleshooting steps.
