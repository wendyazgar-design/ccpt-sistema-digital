import express from 'express';
import { pool } from '../db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.name, u.email, u.role, COUNT(e.id) AS expedientes
      FROM users u
      LEFT JOIN expedientes e ON e.user_id = u.id
      GROUP BY u.id, u.name, u.email, u.role
      ORDER BY u.id ASC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar usuarios', details: error.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar usuario', details: error.message });
  }
});

export default router;
