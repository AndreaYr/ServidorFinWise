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
      }
  },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  });

async function connectSequelize() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a Postgres con Sequelize');
    await sequelize.sync({ alter: true }); // Asegúrate de que las tablas se ajusten si es necesario
  } catch (error) {
    console.error('Error conectando a Postgres:', error);
    throw error;
  }
}

export { sequelize, connectSequelize };