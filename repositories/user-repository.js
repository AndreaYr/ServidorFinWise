import bcrypt from 'bcrypt';
import { connectSequelize } from '../database/sequelize.js';
import User from '../dto/user.js';



class UserRepository {

  async register() {
    const hashedPassword = await bcrypt.hash("12345", 10);
    const username = "PODEROSO2"
    const user = await User.create({
      username,
      password: hashedPassword,
    });
    return "ok";
  }

}

export default UserRepository;