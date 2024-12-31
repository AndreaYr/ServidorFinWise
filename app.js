// index.js (antes server.js o app.js)
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import challenge from './routes/challenge.js';  // Cambia la ruta según tu estructura
import { SIGNING_KEY_COOKIE } from './config/keys.js';
import  { connectDB } from './database/database.js';

const app = express()
  .use(bodyParser.json())
  .use(cookieParser(SIGNING_KEY_COOKIE));

let port = 10101;

app.use('/challenge', challenge);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
  });
});
