import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('testea', 'root', '2024', {
  host: 'localhost',
  dialect: 'mysql'
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
