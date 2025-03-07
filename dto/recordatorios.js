import { DataTypes } from 'sequelize';
import { sequelize } from '../database/sequelize.js';
import Usuario from '../dto/usuario.js';
import MetaAhorro from '../dto/metas_ahorro.js';

const Recordatorios = sequelize.define('Recordatorios', {
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
  meta_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: MetaAhorro,
      key: 'meta_id',
    },
    onDelete: 'CASCADE',
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'recordatorios',
  timestamps: false,
});

Recordatorios.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Recordatorios.belongsTo(MetaAhorro, { foreignKey: 'meta_id' });

export default Recordatorios;