import { registerAs } from '@nestjs/config';
import * as admin from 'firebase-admin';

export default registerAs('firebase', () => {
  const googleCredentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!googleCredentialsPath) {
    throw new Error(
      'GOOGLE_APPLICATION_CREDENTIALS is not set in environment variables.',
    );
  }

  const app = admin.initializeApp({
    credential: admin.credential.cert(googleCredentialsPath),
  });
  return app;
});
