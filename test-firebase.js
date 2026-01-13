const admin = require('firebase-admin');
console.log('✅ Firebase Admin loaded successfully');
try {
  const account = require('./firebase-service-account.json');
  console.log('✅ Service account loaded successfully');
  admin.initializeApp({
    credential: admin.credential.cert(account)
  });
  console.log('✅ Firebase app initialized');
} catch (e) {
  console.error('❌ Error:', e.message);
}
