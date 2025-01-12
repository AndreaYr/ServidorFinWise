// index.js (antes server.js o app.js)
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import challenge from './routes/challenge.js';
import user from './routes/user.js';

import { SIGNING_KEY_COOKIE } from './config/keys.js';
import  { connectDB } from './database/mongo.js';
import  { connectSequelize } from './database/sequelize.js';


const app = express()
  .use(bodyParser.json())
  .use(cookieParser(SIGNING_KEY_COOKIE));


app.use('/challenge', challenge);
app.use('/user', user);


async function startServer() {
  try {
    // Conectar bases de datos
    await connectSequelize();
    await connectDB();

    // Iniciar servidor Express
    const PORT = 10101;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error iniciando la aplicación:', error);
  }
}

startServer();


/*
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
  });
});
*/