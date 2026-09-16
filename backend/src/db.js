import pg from 'pg';
import { config } from './config.js';

const { Pool } = pg;

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
});

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'socio')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS expedientes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      folio TEXT UNIQUE NOT NULL,
      tramite TEXT NOT NULL,
      nombre TEXT NOT NULL,
      curp TEXT,
      rfc TEXT,
      fecha_nacimiento TEXT,
      domicilio TEXT,
      municipio TEXT,
      estado TEXT,
      telefono TEXT,
      correo TEXT,
      profesion TEXT,
      universidad TEXT,
      cedula TEXT,
      fecha_titulacion TEXT,
      postgrado TEXT,
      fecha_registro_colegio TEXT,
      experiencia TEXT,
      numero_colegiado TEXT,
      periodo TEXT,
      observaciones TEXT,
      estatus TEXT DEFAULT 'pendiente',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      expediente_id INTEGER REFERENCES expedientes(id) ON DELETE CASCADE,
      file_name TEXT NOT NULL,
      storage_path TEXT NOT NULL,
      mime_type TEXT,
      uploaded_by INTEGER REFERENCES users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const adminExists = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@ccpt.local']);

  if (adminExists.rowCount === 0) {
    const bcrypt = await import('bcryptjs');
    const passwordHash = await bcrypt.default.hash('Admin123!', 10);
    await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
      ['Administrador', 'admin@ccpt.local', passwordHash, 'admin']
    );
    console.log('Usuario administrador creado con credenciales: admin@ccpt.local / Admin123!');
  }
}

process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});
