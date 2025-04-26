import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../dto/usuario.js'; // <- Aquí ya es User
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

dotenv.config();

class UserRepository {
  constructor() {
    this.collectionName = 'free_ai';
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async findByToken(token) {
    return await User.findOne({ 
      where: { 
        reset_token: token,
        reset_token_expiration: { [Op.gt]: new Date() }
      }
    });
  }

  async saveResetToken(userId, token, expiration) {
    return await User.update(
      { reset_token: token, reset_token_expiration: expiration },
      { where: { id: userId } }
    );
  }

  async updatePassword(userId, hashedPassword) {
    return await User.update(
      { 
        contrasenia: hashedPassword, 
        reset_token: null, 
        reset_token_expiration: null 
      },
      { where: { id: userId } }
    );
  }

  async clearResetToken(id) {
    await User.update(
      { reset_token: null, reset_token_expiration: null },
      { where: { id } }
    );
  }

  async register(info) {
    try {
      const usuarioExiste = await User.findOne({ where: { email: info.email } });
      if (usuarioExiste) {
        throw new Error("El correo ya está registrado");
      }

      const contraseniaEncriptada = await bcrypt.hash(info.contrasenia, 10);

      const nuevoUsuario = await User.create({
        id: info.id,
        cedula: info.cedula,
        nombre: info.nombre,
        apellidos: info.apellidos,
        email: info.email,
        contrasenia: contraseniaEncriptada
      });

      return { message: "Usuario creado con éxito", usuario: nuevoUsuario };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default UserRepository;
