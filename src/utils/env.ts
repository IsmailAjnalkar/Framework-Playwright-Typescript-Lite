// Loads environment variables from a .env file at the project root (if present).
import dotenv from 'dotenv';
import path from 'path';

const envFile = path.resolve(process.cwd(), '.env');
const result = dotenv.config({ path: envFile });

if (result.error && process.env.NODE_ENV !== 'production') {
  console.warn(`dotenv: no .env file at ${envFile}; using environment variables only.`);
}
