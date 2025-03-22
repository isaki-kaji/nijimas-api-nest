import { registerAs } from '@nestjs/config';
import * as admin from 'firebase-admin';

export default registerAs('firebase', () => {
  const firebaseCredentialsPath = process.env.FIREBASE_APPLICATION_CREDENTIALS;

  if (!firebaseCredentialsPath) {
    throw new Error(
      'FIREBASE_APPLICATION_CREDENTIALS is not set in environment variables.',
    );
  }

  const app = admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentialsPath),
  });
  return app.auth();
});
