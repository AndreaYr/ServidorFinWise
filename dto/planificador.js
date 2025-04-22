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
    onDelete: 'CASCADE', // Asegúrate de que esta relación sea válida
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_gasto: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['fijo', 'variable']], // Asegúrate de que los valores sean válidos
    },
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  monto_previsto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'planificador',
  timestamps: false,
});

Planificador.belongsTo(Usuario, { foreignKey: 'usuario_id' });

export default Planificador;