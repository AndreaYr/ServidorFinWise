import { DataTypes } from 'sequelize';
import { sequelize } from '../database/sequelize.js';

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},{
    timestamps: false, 
  });

export default User;
