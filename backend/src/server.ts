import mongoose from 'mongoose';
import app from './app';
import { env } from './config/env';

const bootstrap = async () => {
  await mongoose.connect(env.mongodbUri);
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on port ${env.port}`);
  });
};

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', error);
  process.exit(1);
});
