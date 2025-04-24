import { DataTypes } from 'sequelize';
import { sequelize } from '../database/sequelize.js';
import Usuario from '../dto/usuario.js';

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
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['pendiente', 'completado']],
    },
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      isAfterFechaInicio(value) {
        if (value <= this.fecha_inicio) {
          throw new Error('La fecha de vencimiento debe ser posterior a la fecha de inicio.');
        }
      },
    },
  },
}, {
  tableName: 'recordatorios',
  timestamps: false,
});

Recordatorios.belongsTo(Usuario, { foreignKey: 'usuario_id' });

export default Recordatorios;
