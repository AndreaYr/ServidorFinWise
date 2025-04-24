import { DataTypes } from 'sequelize';
import { sequelize } from '../database/sequelize.js';
import Usuario from '../dto/usuario.js';

const Planificador = sequelize.define('Planificador', {
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
    onDelete: 'CASCADE',
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  monto_previsto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  gastos_reales: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  diferencia: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
}, {
  tableName: 'planificador',
  timestamps: false,
});

Planificador.belongsTo(Usuario, { foreignKey: 'usuario_id' });

export default Planificador;
