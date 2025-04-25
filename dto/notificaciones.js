import { DataTypes } from 'sequelize';
import { sequelize } from '../database/sequelize.js';
import Usuario from './usuario.js';

const Notificaciones = sequelize.define('Notificaciones', {
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
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  leida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'notificaciones',
  timestamps: false,
});

Notificaciones.belongsTo(Usuario, { foreignKey: 'usuario_id' });

export default Notificaciones;
