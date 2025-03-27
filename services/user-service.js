class UserService {

  constructor(userRepository) {
    this.userRepository = userRepository;
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

}

export default UserService;