import crypto from 'crypto';
import bcrypt from 'bcrypt';

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

      return await this.userRepository.login(info);
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

    const resetLink = `http://localhost:3000/reset-password/${token}`;
    await this.mailer.send(
        user.email,
        'Recuperación de contraseña',
        `Haz clic en el siguiente enlace para restablecer tu contraseña: <a href=" ${resetLink} ">${resetLink}</a>`
    );
    return 'Se ha enviado un enlace de recuperación a tu email.';
  }

  async resetPassword(token, newPassword) {
    const user = await this.userRepository.findByToken(token);
    if (!user || new Date(user.reset_token_expiration) < new Date()) {
        throw new Error('Token inválido o expirado.');
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updatePassword(user.id, hashedPassword);
  }

}

export default UserService;