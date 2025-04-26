import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import  Usuario  from './dto/usuario.js'; // Asegúrate de que la ruta sea correcta
import user from './routes/user.js';
import dashboard from './routes/dashboard.js';
import { connectSequelize } from './database/sequelize.js';
import dotenv from 'dotenv';
import cors from 'cors';
import verifyToken from './middleware/verifyToken.js';

dotenv.config();


const PORT = process.env.PORT || 3000;
const app = express()


  .use(express.json()) // Asegúrate de que este middleware esté configurado
  .use(bodyParser.json()) // Si usas body-parser, asegúrate de incluirlo
  .use((req, res, next) => {
    next();
  })
  .use(cookieParser(process.env.COOKIE_SECRET))
  .use(cors({
    origin: '*',
    credentials: true,
    methods: '*',
    allowedHeaders: '*',
  }));  


//Rutas de autenticación
app.use('/dashboard', dashboard);

// Rutas públicas (no requieren autenticación)
app.use('/user', user);

async function startServer() {
  try {
    await connectSequelize(); // Conectar a la base de datos
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error iniciando la aplicación:', error);
  }
}

startServer();

