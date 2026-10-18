import dotenv from 'dotenv';
import path from 'path';

// Load .env if present
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',

  // MySQL Settings (Aiven & Cloud MySQL with SSL/TLS)
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'defaultdb',
    connectionLimit: 10,
    connectTimeout: 10000,
    ssl: (process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1') || process.env.DB_SSL === 'true'
      ? { rejectUnauthorized: false }
      : undefined,
  },

  // JWT Security
  jwt: {
    secret: process.env.JWT_SECRET || 'jijamata_nashik_shg_secure_jwt_secret_key_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // Admin Initial Seed Credentials
  admin: {
    name: process.env.ADMIN_NAME || 'Sunita Patil (SHG Coordinator)',
    email: process.env.ADMIN_EMAIL || 'admin@jijamata.org',
    password: process.env.ADMIN_PASSWORD || 'Jijamata@Nashik2026',
    phone: process.env.ADMIN_PHONE || '+91 94222 12345',
  },
};
