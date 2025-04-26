import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Usuario from '../dto/usuario.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

dotenv.config();

class UserRepository {
  constructor() {
    this.collectionName = 'free_ai';
  }

  async findByEmail(email) {
    return await Usuario.findOne({ where: { email } });
  }

  async findByToken(token) {
    return await Usuario.findOne({ 
      where: { 
        reset_token: token,
        reset_token_expiration: {[Op.gt]: new Date()} } });
  }

  async saveResetToken(userId, token, expiration) {
    return await Usuario.update(
      { reset_token: token, reset_token_expiration: expiration },
      { where: { id: userId } }
    );
  }

  async updatePassword(userId, hashedPassword) {
    return await Usuario.update(
      { contrasenia: hashedPassword, 
        reset_token: null, 
        reset_token_expiration: null },
      { where: { id: userId } }
    );
  }

  //Método para registrar un usuario
  async register(info) {

    try{
      //Verificar si el usuario existe
      const usuarioExiste = await Usuario.findOne({ where: { email: info.email}});
      if(usuarioExiste){
        throw new Error("El correo ya está registrado");
      }

      //Encriptar contraseña
      const contraseniaEncriptada = await bcrypt.hash(info.contrasenia, 10);

      //Guardar usuario
      const nuevoUsuario = await Usuario.create({
        id: info.id,
        cedula: info.cedula,
        nombre: info.nombre,
        apellidos: info.apellidos,
        email: info.email,
        contrasenia: contraseniaEncriptada
      });

      return {message: "Usuario creado con éxito", usuario: nuevoUsuario};
    }catch (error){
      throw new Error(error.message);
    }
  }

  
}

export default UserRepository;