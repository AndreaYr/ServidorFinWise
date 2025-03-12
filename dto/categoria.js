import { DataTypes } from 'sequelize';
import { sequelize } from '../database/sequelize.js';

// Definición del modelo Categoria
const Categoria = sequelize.define('Categoria', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['ingreso', 'gasto']],
    },
  },
  icono: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'categorias',
  timestamps: false,
});

export default Categoria;