import express from 'express'; import cors from 'cors'; import helmet from 'helmet'; import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js'; import expedienteRoutes from './routes/expedientes.js'; import documentRoutes from './routes/documents.js'; import { initializeDatabase } from './db.js'; import { config } from './config.js';
const app=express(); app.disable('x-powered-by'); app.set('trust proxy',1); app.use(helmet()); app.use(cors({origin:config.frontendOrigin,credentials:false})); app.use(express.json({limit:'1mb'})); app.use(express.urlencoded({extended:false,limit:'1mb'}));
const loginLimit=rateLimit({windowMs:15*60*1000,max:20,standardHeaders:true,legacyHeaders:false}); const apiLimit=rateLimit({windowMs:15*60*1000,max:300,standardHeaders:true,legacyHeaders:false});
app.use('/api',apiLimit); app.use('/api/auth/login',loginLimit); app.get('/api/health',(_req,res)=>res.json({ok:true})); app.use('/api/auth',authRoutes); app.use('/api/expedientes',expedienteRoutes); app.use('/api/documents',documentRoutes);
app.use((err,_req,res,_next)=>{console.error(err);res.status(500).json({message:'Error interno del servidor'});});
initializeDatabase().then(()=>app.listen(config.port,()=>console.log(`API en puerto ${config.port}`))).catch(err=>{console.error('No se pudo iniciar la API',err);process.exit(1);});
