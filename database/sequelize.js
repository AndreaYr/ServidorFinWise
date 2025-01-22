import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
  }
});

async function connectSequelize() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a MySQL con Sequelize');
    await sequelize.sync();
  } catch (error) {
    console.error('Error conectando a MySQL:', error);
    throw error;
  }
}

export { sequelize, connectSequelize };
