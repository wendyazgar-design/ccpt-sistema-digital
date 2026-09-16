import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function authMiddleware(req, res, next) {
  const value = req.get('authorization') || '';
  if (!/^Bearer\s+\S+$/.test(value)) return res.status(401).json({ message: 'Autenticación requerida' });
  try { req.user = jwt.verify(value.slice(7), config.jwtSecret); return next(); }
  catch { return res.status(401).json({ message: 'Sesión inválida o expirada' }); }
}
export function requireRole(...roles) {
  return (req, res, next) => roles.includes(req.user?.role) ? next() : res.status(403).json({ message: 'Permisos insuficientes' });
}
