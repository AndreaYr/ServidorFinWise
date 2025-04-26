import { DataTypes } from 'sequelize';
import { sequelize } from '../database/sequelize.js';
import Usuario from '../dto/usuario.js'; 

const ChatBot = sequelize.define('ChatBot', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Usuario,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  pregunta: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  respuesta: {
    type: DataTypes.TEXT,
    allowNull: true, 
  },
  sensible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Por defecto, las conversaciones no son sensibles
  },
}, {
  tableName: 'chat_bot',
  timestamps: false,
});

ChatBot.belongsTo(Usuario, { foreignKey: 'usuario_id' });

export default ChatBot;