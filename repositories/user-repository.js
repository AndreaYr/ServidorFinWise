import bcrypt from 'bcrypt';
import { connectSequelize } from '../database/sequelize.js';
import User from '../dto/user.js';
import jwt from 'jsonwebtoken';
import { getDB } from '../database/mongo.js';
import dotenv from 'dotenv';
dotenv.config();


class UserRepository {
  constructor() {
    this.collectionName = 'free_ai';
}

  async register(info) {
    const hashedPassword = await bcrypt.hash(info.password, 10);
    const user = await User.create({
      email: info.email,
      password: hashedPassword,
    });
    const db = getDB();
    const result = await db.collection(this.collectionName).insertOne({
        email: info.email,
        ai_aids: 10
    });
    return "ok";
  }

  async login(info) {
    try {
      const email = info.email;
      const password = info.password;

      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return {login: false};
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return {login: false};
      }

      const token = jwt.sign(
        { userEmail: email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } 
      );
      return {login: true, token}

    } catch (error) {
      console.error(error);
    }
  }

}

export default UserRepository;