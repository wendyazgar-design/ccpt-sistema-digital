import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const requiredInProduction = ['JWT_SECRET', 'DATABASE_URL', 'FRONTEND_ORIGIN'];
if (isProduction) {
  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Faltan variables de producción: ${missing.join(', ')}`);
}

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'dev-only-change-me',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || '',
  db: {
    host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'ccpt', user: process.env.DB_USER || 'postgres', password: process.env.DB_PASSWORD || 'postgres',
  },
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxFileBytes: Number(process.env.MAX_FILE_BYTES || 10 * 1024 * 1024),
};
