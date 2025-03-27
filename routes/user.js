import express from 'express';
import UserController from '../controllers/user-controller.js';
import UserService from '../services/user-service.js';
import UserRepository from '../repositories/user-repository.js';
import verifyToken from '../middleware/verifyToken.js'
import validatorRegister from '../middleware/register-validator.js';
import validatorLogin from '../middleware/login-validator.js';

const router = express.Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/register', validatorRegister.validatorParams, validatorRegister.validator, userController.register);
router.post('/login', validatorLogin.validatorParams, validatorLogin.validator, userController.login);
router.get('/profile', verifyToken, userController.profile);

export default router;
