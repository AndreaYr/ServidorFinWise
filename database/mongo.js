import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();


const client = new MongoClient(process.env.MONGO_URI);


let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('autojudge');
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
  }
}

function getDB() {
  if (!db) {
    throw new Error('La base de datos no está conectada');
  }
  return db;
}

export { connectDB, getDB };
