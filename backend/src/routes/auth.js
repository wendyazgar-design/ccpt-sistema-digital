import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { config } from '../config.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, role = 'socio' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nombre, correo y contraseña son obligatorios' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, passwordHash, role]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, config.jwtSecret, { expiresIn: '8h' });

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', details: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Se requiere correo y contraseña' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, config.jwtSecret, { expiresIn: '8h' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error de autenticación', details: error.message });
  }
});

export default router;
