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
    return db;
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
  }
}


class UpdateAiAids {
  constructor() {
    this.collectionName = 'free_ai';
}

async updateAllAiAids() {
  const db = await connectDB();
  const result = await db.collection(this.collectionName).updateMany({}, { $set: { ai_aids: 10 } });
  return result.modifiedCount;
}

}

let updateAiAids = new UpdateAiAids();
updateAiAids.updateAllAiAids();