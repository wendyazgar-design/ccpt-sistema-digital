import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool, audit } from '../db.js';
import { config } from '../config.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/register', async (req, res) => {
  const name = String(req.body.name || '').trim(); const email = String(req.body.email || '').trim().toLowerCase(); const password = String(req.body.password || '');
  if (!name || !emailPattern.test(email) || password.length < 12) return res.status(400).json({ message: 'Nombre, correo válido y contraseña de al menos 12 caracteres son obligatorios' });
  try {
    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query('INSERT INTO users (name,email,password_hash,role) VALUES ($1,$2,$3,$4) RETURNING id,name,email,role', [name, email, hash, 'socio']);
    await audit(result.rows[0].id, 'REGISTER', 'user', result.rows[0].id, req.ip);
    res.status(201).json({ user: result.rows[0] });
  } catch (error) { if (error.code === '23505') return res.status(409).json({ message: 'El correo ya está registrado' }); res.status(500).json({ message: 'No se pudo registrar el usuario' }); }
});

router.post('/users', authMiddleware, requireRole('admin'), async (req, res) => {
  const name = String(req.body.name || '').trim(); const email = String(req.body.email || '').trim().toLowerCase(); const password = String(req.body.password || ''); const role = req.body.role === 'admin' ? 'admin' : 'socio';
  if (!name || !emailPattern.test(email) || password.length < 12) return res.status(400).json({ message: 'Datos de usuario inválidos' });
  try { const hash = await bcrypt.hash(password, 12); const result = await pool.query('INSERT INTO users (name,email,password_hash,role) VALUES ($1,$2,$3,$4) RETURNING id,name,email,role', [name,email,hash,role]); await audit(req.user.id,'CREATE','user',result.rows[0].id,req.ip); res.status(201).json(result.rows[0]); }
  catch (error) { if (error.code === '23505') return res.status(409).json({ message: 'El correo ya está registrado' }); res.status(500).json({ message: 'No se pudo crear el usuario' }); }
});

router.post('/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase(); const password = String(req.body.password || '');
  try { const result = await pool.query('SELECT id,name,email,password_hash,role FROM users WHERE email=$1', [email]); const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) { await audit(null,'LOGIN_FAILED','user',null,req.ip); return res.status(401).json({ message: 'Credenciales inválidas' }); }
    const token = jwt.sign({ id:user.id, role:user.role, email:user.email }, config.jwtSecret, { expiresIn:'8h', subject:String(user.id) });
    await audit(user.id,'LOGIN','user',user.id,req.ip); res.json({ token, user:{ id:user.id,name:user.name,email:user.email,role:user.role } });
  } catch { res.status(500).json({ message: 'No se pudo iniciar sesión' }); }
});
router.get('/me', authMiddleware, async (req,res) => { const r=await pool.query('SELECT id,name,email,role FROM users WHERE id=$1',[req.user.id]); if(!r.rowCount)return res.status(404).json({message:'Usuario no encontrado'}); res.json(r.rows[0]); });
export default router;
