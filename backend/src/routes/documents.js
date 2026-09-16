import express from 'express';
import { pool } from '../db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const { tramite, nombre, curp, rfc, correo, telefono, ...rest } = req.body;

  if (!tramite || !nombre) {
    return res.status(400).json({ message: 'Trámite y nombre son obligatorios' });
  }

  const userId = req.user.role === 'admin' ? Number(req.body.user_id || req.user.id) : req.user.id;
  const folio = `CCPT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

  try {
    const result = await pool.query(
      `
        INSERT INTO expedientes (
          user_id, folio, tramite, nombre, curp, rfc, fecha_nacimiento, domicilio, municipio,
          estado, telefono, correo, profesion, universidad, cedula, fecha_titulacion,
          postgrado, fecha_registro_colegio, experiencia, numero_colegiado, periodo,
          observaciones, estatus
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
        RETURNING *
      `,
      [
        userId,
        folio,
        tramite,
        nombre,
        rest.curp || null,
        rest.rfc || null,
        rest.fecha_nacimiento || null,
        rest.domicilio || null,
        rest.municipio || null,
        rest.estado || 'Tabasco',
        telefono || null,
        correo || null,
        rest.profesion || null,
        rest.universidad || null,
        rest.cedula || null,
        rest.fecha_titulacion || null,
        rest.postgrado || null,
        rest.fecha_registro_colegio || null,
        rest.experiencia || null,
        rest.numero_colegiado || null,
        rest.periodo || null,
        rest.observaciones || null,
        'pendiente',
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear expediente', details: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = `
      SELECT e.*, u.name AS propietario
      FROM expedientes e
      JOIN users u ON u.id = e.user_id
    `;
    const params = [];

    if (req.user.role === 'socio') {
      query += ' WHERE e.user_id = $1';
      params.push(req.user.id);
    }

    query += ' ORDER BY e.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar expedientes', details: error.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, u.name AS propietario FROM expedientes e JOIN users u ON u.id = e.user_id WHERE e.id = $1`,
      [req.params.id]
    );

    const expediente = result.rows[0];
    if (!expediente) {
      return res.status(404).json({ message: 'Expediente no encontrado' });
    }

    if (req.user.role === 'socio' && expediente.user_id !== req.user.id) {
      return res.status(403).json({ message: 'No puedes consultar este expediente' });
    }

    res.json(expediente);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar expediente', details: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM expedientes WHERE id = $1',
      [req.params.id]
    );

    const expediente = result.rows[0];
    if (!expediente) {
      return res.status(404).json({ message: 'Expediente no encontrado' });
    }

    if (req.user.role === 'socio' && expediente.user_id !== req.user.id) {
      return res.status(403).json({ message: 'No puedes editar este expediente' });
    }

    const { tramite, nombre, curp, rfc, correo, telefono, ...rest } = req.body;

    const fields = [
      'tramite', 'nombre', 'curp', 'rfc', 'fecha_nacimiento', 'domicilio', 'municipio', 'estado',
      'telefono', 'correo', 'profesion', 'universidad', 'cedula', 'fecha_titulacion', 'postgrado',
      'fecha_registro_colegio', 'experiencia', 'numero_colegiado', 'periodo', 'observaciones', 'estatus'
    ];

    const updates = [];
    const values = [];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = $${values.length + 1}`);
        values.push(req.body[field]);
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No se enviaron campos para actualizar' });
    }

    values.push(req.params.id);
    const query = `UPDATE expedientes SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;
    const updated = await pool.query(query, values);

    res.json(updated.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar expediente', details: error.message });
  }
});

router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM expedientes WHERE id = $1', [req.params.id]);
    res.json({ message: 'Expediente eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar expediente', details: error.message });
  }
});

export default router;
