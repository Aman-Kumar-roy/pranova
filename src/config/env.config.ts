import dotenv from 'dotenv';
import path from 'path';

// Load .env from workspace root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// 1. Resolve Database Configuration (Bagisto Style)
const dbConnection = process.env.DB_CONNECTION || 'pgsql';
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = Number(process.env.DB_PORT) || 5432;
const dbDatabase = process.env.DB_DATABASE || 'pranova_db';
const dbUsername = process.env.DB_USERNAME || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'postgres';
const dbSchema = process.env.DB_SCHEMA || 'public';

// Construct standard Prisma DATABASE_URL if missing or contains raw template placeholders
let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || databaseUrl.includes('${')) {
  databaseUrl = `postgresql://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbDatabase}?schema=${dbSchema}&pgbouncer=true&connection_limit=1`;
  process.env.DATABASE_URL = databaseUrl;
}

export const config = {
  app: {
    name: process.env.APP_NAME || 'PRANOVA',
    env: process.env.APP_ENV || process.env.NODE_ENV || 'development',
    debug: process.env.APP_DEBUG === 'true',
    url: process.env.APP_URL || 'http://localhost:5000',
    port: Number(process.env.PORT) || 5000,
    timezone: process.env.APP_TIMEZONE || 'Asia/Kolkata',
  },
  db: {
    connection: dbConnection,
    host: dbHost,
    port: dbPort,
    database: dbDatabase,
    username: dbUsername,
    password: dbPassword,
    schema: dbSchema,
    url: databaseUrl,
  },
  admin: {
    firstName: process.env.ADMIN_FIRST_NAME || 'Super',
    lastName: process.env.ADMIN_LAST_NAME || 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@pranova.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    phone: process.env.ADMIN_PHONE || '+919876500000',
    department: process.env.ADMIN_DEPARTMENT || 'Operations',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'pranova_super_secret_jwt_access_token_key_2026_healthcare',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'pranova_super_secret_jwt_refresh_token_key_2026_healthcare',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    allowedOrigins: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
      : ['http://localhost:5173', 'http://localhost:3000'],
    adminWebUrl: process.env.ADMIN_WEB_URL || 'http://localhost:5173',
  },
  swagger: {
    enabled: process.env.ENABLE_SWAGGER !== 'false',
  },
};

export default config;
