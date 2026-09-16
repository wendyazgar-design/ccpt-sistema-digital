import pg from 'pg';
import bcrypt from 'bcryptjs';
import { config } from './config.js';
const { Pool } = pg;

export const pool = new Pool(config.databaseUrl
  ? { connectionString: config.databaseUrl, ssl: config.isProduction ? { rejectUnauthorized: false } : undefined }
  : { ...config.db, ssl: config.isProduction ? { rejectUnauthorized: false } : undefined });

export async function initializeDatabase() {
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK (role IN ('admin','socio')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS expedientes (
    id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    folio TEXT UNIQUE NOT NULL, tramite TEXT NOT NULL, nombre TEXT NOT NULL, curp TEXT, rfc TEXT,
    fecha_nacimiento TEXT, domicilio TEXT, municipio TEXT, estado TEXT, telefono TEXT, correo TEXT,
    profesion TEXT, universidad TEXT, cedula TEXT, fecha_titulacion TEXT, postgrado TEXT,
    fecha_registro_colegio TEXT, experiencia TEXT, numero_colegiado TEXT, periodo TEXT,
    observaciones TEXT, estatus TEXT NOT NULL DEFAULT 'pendiente', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY, expediente_id INTEGER NOT NULL REFERENCES expedientes(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL, storage_path TEXT NOT NULL, mime_type TEXT NOT NULL, size_bytes INTEGER NOT NULL,
    uploaded_by INTEGER NOT NULL REFERENCES users(id), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, entity TEXT, entity_id TEXT, ip TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);

  // Nunca se crea un administrador con una contraseña fija. El alta inicial requiere variables explícitas.
  if (process.env.BOOTSTRAP_ADMIN_EMAIL && process.env.BOOTSTRAP_ADMIN_PASSWORD) {
    const email = process.env.BOOTSTRAP_ADMIN_EMAIL.trim().toLowerCase();
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (!exists.rowCount) {
      const hash = await bcrypt.hash(process.env.BOOTSTRAP_ADMIN_PASSWORD, 12);
      await pool.query('INSERT INTO users (name,email,password_hash,role) VALUES ($1,$2,$3,$4)', [process.env.BOOTSTRAP_ADMIN_NAME || 'Administrador', email, hash, 'admin']);
      console.log(`Administrador inicial creado para ${email}.`);
    }
  }
}

export async function audit(userId, action, entity, entityId, ip) {
  await pool.query('INSERT INTO audit_log (user_id, action, entity, entity_id, ip) VALUES ($1,$2,$3,$4,$5)', [userId || null, action, entity || null, entityId ? String(entityId) : null, ip || null]);
}

process.on('SIGINT', async () => { await pool.end(); process.exit(0); });
