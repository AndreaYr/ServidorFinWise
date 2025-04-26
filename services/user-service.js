import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

class UserService {

  constructor(userRepository, mailer) {
    this.userRepository = userRepository;
    this.mailer = mailer; // Asegúrate de recibir el mailer aquí
  }

  async register(info) {

    try{
      //Validamos los datos de entrada
      if(!info.cedula || !info.nombre || !info.apellidos || !info.email || !info.contrasenia){
        throw new Error("Todos los campos son obligatorios");
      }
      console.log("Usuario válido, procesando registro...");


      //llamamos al repositorio para registrar el usuario
      return await this.userRepository.register(info);
    }catch (error){
      throw new Error(error.message);
    }
  }

  async login(info) {

    try{
      //Validamos que los campos sean correctos
      if(!info.email || !info.contrasenia){
        throw new Error("Email y contraseña son obligatorios.")
      }

      const usuario = await this.userRepository.findByEmail(info.email);
      if(!usuario){
        throw new Error("Usuario no encontrado.")
      }

      //Validamos la contraseña
      const isPasswordValid = await bcrypt.compare(info.contrasenia, usuario.contrasenia);
      if (!isPasswordValid) {
        throw new Error("Contraseña incorrecta.");
      }

      // Generar token JWT
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return { token, usuario };
    }catch (error){
      throw new Error(error.message);
    }
    
  }

  async forgotPassword(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
        throw new Error('No existe un usuario con ese email.');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 3600000); // 1 hora de expiración

    await this.userRepository.saveResetToken(user.id, token, expiration);

    const resetLink = `http://localhost:5173/restablecer-contraseña?token=${token}`;
    await this.mailer.send(
        user.email,
        'Recuperación de contraseña',
        `Haz clic en el siguiente enlace para restablecer tu contraseña: <a href=" ${resetLink} ">${resetLink}</a><br/>
        <p>Si no solicitaste esto, ignora este correo.</p>`
    );
    return 'Se ha enviado un enlace de recuperación a tu email.';
  }

  async resetPassword(token, contrasenia) {
    // Buscar al usuario por el reset_token
    const user = await this.userRepository.findByToken(token)

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (new Date(user.reset_token_expiration) < new Date()) {
        throw new Error('Token inválido o expirado.');
    }
  
    const hashedPassword = await bcrypt.hash(contrasenia, 10);
    await this.userRepository.updatePassword(user.id, hashedPassword);
    await this.userRepository.clearResetToken(user.id);
  }

}

export default UserService;