import { DataTypes } from 'sequelize';
import { sequelize } from '../database/sequelize.js';
import Usuario from '../dto/usuario.js'; 

const MetaAhorro = sequelize.define('MetaAhorro', {
  meta_id: {
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
  nombre: {
    type: DataTypes.STRING,
    allowNull: false, // Asegúrate de que este campo sea necesario
  },
  monto_objetivo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  monto_actual: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0, // Valor predeterminado
  },
  fecha_limite: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendiente',
    validate: {
      isIn: [['pendiente', 'en progreso', 'completado']],
    },
  },
}, {
  tableName: 'metas_ahorro',
  timestamps: false,
});

MetaAhorro.belongsTo(Usuario, { foreignKey: 'usuario_id' });

export default MetaAhorro;