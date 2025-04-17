import express from 'express';
import UserController from '../controllers/user-controller.js';
import UserService from '../services/user-service.js';
import UserRepository from '../repositories/user-repository.js';
import verifyToken from '../middleware/verifyToken.js';
import validatorRegister from '../middleware/register-validator.js';
import validatorLogin from '../middleware/login-validator.js';
import validatorForgotPassword from '../middleware/forgotPassword-validator.js';
import validatorResetPassword from '../middleware/resetPassword-validator.js';
import Mailer from '../config/Mailer.js';

const router = express.Router();
const mailer = new Mailer();
const userRepository = new UserRepository();
const userService = new UserService(userRepository, mailer);
const userController = new UserController(userService);

router.post('/register', validatorRegister.validatorParams, validatorRegister.validator, userController.register);
router.post('/login', validatorLogin.validatorParams, validatorLogin.validator, userController.login);
router.post('/forgot-password', validatorForgotPassword.validatorParams, validatorForgotPassword.validator, userController.forgotPassword);
router.post('/reset-password', validatorResetPassword.validatorParams, validatorResetPassword.validator, userController.resetPassword);
router.get('/profile', verifyToken, userController.profile);

export default router;
