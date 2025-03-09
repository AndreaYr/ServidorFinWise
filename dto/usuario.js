import { DataTypes } from "sequelize";
import { sequelize } from "../database/sequelize.js";

const Usuario = sequelize.define('usuarios', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cedula: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellidos: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            isEmail: true,
        },
    },
    contrasenia: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            len: [8, 255]
        }
    }
}, {
    timestamps: false
});

export default Usuario;