// index.js (antes server.js o app.js)
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import challenge from './routes/challenge.js';
import user from './routes/user.js';

import  { connectDB } from './database/mongo.js';
import  { connectSequelize } from './database/sequelize.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express()
  .use(bodyParser.json())
  .use(cookieParser(process.env.COOKIE_SECRET));


app.use('/challenge', challenge);
app.use('/user', user);


async function startServer() {
  try {
    await connectSequelize();
    await connectDB();
    const PORT = 10101;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error iniciando la aplicación:', error);
  }
}

startServer();