

class UserService {

  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(info) {
    let infoRegister = await this.userRepository.register();
    return infoRegister;
  }

}

export default UserService;