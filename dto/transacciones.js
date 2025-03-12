import { DataTypes } from 'sequelize';
import { sequelize } from '../database/sequelize.js';
import Usuario from '../dto/usuario.js';
import Categoria from '../dto/categoria.js';

// Definición del modelo Transacciones
const Transacciones = sequelize.define('Transacciones', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id',
    },
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Categoria,
      key: 'id',
    },
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['ingreso', 'gasto']],
    },
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'transacciones',
  timestamps: false,
});

// Definición de relaciones
Transacciones.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Transacciones.belongsTo(Categoria, { foreignKey: 'categoria_id' });

export default Transacciones;