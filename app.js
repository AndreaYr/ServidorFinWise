import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import user from './routes/user.js';
import dashboard from './routes/dashboard.js';
import { connectSequelize } from './database/sequelize.js';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();


const PORT = process.env.PORT || 3000;
const app = express()
  .use(bodyParser.json())
  .use(cookieParser(process.env.COOKIE_SECRET))
  .use(cors({
    origin: '*',
    credentials: true,
    methods: '*',
    allowedHeaders: '*',
  }));  

// Middleware de autenticación simulado
app.use((req, res, next) => {
  req.user = { id: 1 }; // Esto debería ser reemplazado por la lógica real de autenticación
  console.log('Authenticated User:', req.user); // Agregar log para verificar el userId
  next();
});

// Rutas
app.use('/user', user);
app.use('/dashboard', dashboard);

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

