import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import expedienteRoutes from './routes/expedientes.js';
import documentRoutes from './routes/documents.js';
import { initializeDatabase } from './db.js';
import { config } from './config.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'CCPT API funcionando', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/expedientes', expedienteRoutes);
app.use('/api/documents', documentRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor', details: err.message || 'Desconocido' });
});

async function start() {
  try {
    await initializeDatabase();
    app.listen(config.port, () => {
      console.log(`Servidor ejecutándose en http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar la API:', error);
    process.exit(1);
  }
}

start();
