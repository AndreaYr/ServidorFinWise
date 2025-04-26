import express from 'express';
import DashboardController from '../controllers/dashboard-controller.js';
import validatorAddTransactions from '../middleware/addTransactions-validator.js';
import validatorDeleteTransactions from '../middleware/deleteTransaction-validator.js';
import validatorModifyTransactions from '../middleware/modifyTransactions-validator.js';
import validatorAddGoal from '../middleware/addGoal-validator.js';
import validatorDeleteGoal from '../middleware/deleteGoal-validator.js';
import validatorModifyGoal from '../middleware/modifyGoal-validator.js';
import validatorAddExpensePlanner from '../middleware/addExpensePlanner-validator.js';
import validatorDeleteExpensePlanner from '../middleware/deleteExpensePlanner-validator.js';
import validatorModifyExpensePlanner from '../middleware/modifyExpensePlanner-validator.js';
import validatorAddCategory from '../middleware/addCategory-validator.js';
import validatorDeleteCategory from '../middleware/deleteCategory-validator.js';
import validatorModifyCategory from '../middleware/modifyCategory-validator.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();
const dashboardController = new DashboardController();

/* Asegurarse de que el usuario está autenticado antes de acceder a la ruta /data */
router.get('/data', verifyToken, (req, res) => dashboardController.getData(req, res));

// Rutas para manejar transacciones
router.post('/addTransactions', verifyToken, validatorAddTransactions.validatorParams, validatorAddTransactions.validator, (req, res) => dashboardController.addTransaction(req, res));
router.delete('/deleteTransactions', verifyToken, validatorDeleteTransactions.validatorParams, validatorDeleteTransactions.validator, (req, res) => dashboardController.deleteTransaction(req, res));
router.put('/modifyTransactions', verifyToken, validatorModifyTransactions.validatorParams, validatorModifyTransactions.validator, (req, res) => dashboardController.modifyTransaction(req, res));

// Rutas para manejar metas de ahorro
router.post('/addGoal', verifyToken, validatorAddGoal.validatorParams, validatorAddGoal.validator, (req, res) => dashboardController.addGoal(req, res));
router.delete('/deleteGoal', verifyToken, validatorDeleteGoal.validatorParams, validatorDeleteGoal.validator, (req, res) => dashboardController.deleteGoal(req, res));
router.put('/modifyGoal', verifyToken, validatorModifyGoal.validatorParams, validatorModifyGoal.validator, (req, res) => dashboardController.modifyGoal(req, res));

// Ruta para manejar el planificador
router.post('/addExpensePlanner', verifyToken, validatorAddExpensePlanner.validatorParams, validatorAddExpensePlanner.validator, (req, res) => dashboardController.addExpensePlanner(req, res));
router.delete('/deleteExpensePlanner', verifyToken, validatorDeleteExpensePlanner.validatorParams, validatorDeleteExpensePlanner.validator, (req, res) => dashboardController.deleteExpensePlanner(req, res)); 
router.put('/modifyExpensePlanner', verifyToken, validatorModifyExpensePlanner.validatorParams, validatorModifyExpensePlanner.validator, (req, res) => dashboardController.modifyExpensePlanner(req, res));

// Rutas para manejar categorías
router.post('/addCategory', verifyToken, validatorAddCategory.validatorParams, validatorAddCategory.validator, (req, res) => dashboardController.addCategory(req, res));
router.put('/modifyCategory', verifyToken, validatorModifyCategory.validatorParams, validatorModifyCategory.validator, (req, res) => dashboardController.modifyCategory(req, res));
router.delete('/deleteCategory', verifyToken, validatorDeleteCategory.validatorParams, validatorDeleteCategory.validator, (req, res) => dashboardController.deleteCategory(req, res));
router.get('/getCategory', verifyToken, (req, res) => dashboardController.getCategorias(req, res));

// Ruta para manejar recordatorios
router.post('/addReminder', verifyToken, (req, res) => dashboardController.addReminder(req, res));
router.delete('/deleteReminder', verifyToken, (req, res) => dashboardController.deleteReminder(req, res));
router.put('/modifyReminder', verifyToken, (req, res) => dashboardController.modifyReminder(req, res));

// Ruta para manejar preguntas del usuario mediante el modelo de IA
router.post('/askAI', verifyToken, (req, res) => dashboardController.askAI(req, res));

// Ruta para obtener el historial de conversaciones del usuario con la IA
router.get('/chatHistory', verifyToken, (req, res) => dashboardController.getChatHistory(req, res));

// Rutas para manejar las notificaciones
router.get('/notificaciones', verifyToken, (req, res) => dashboardController.getNotificaciones(req, res));
router.post('/notificaciones/marcar-leidas', verifyToken, (req, res) => dashboardController.marcarNotificacionesLeidas(req, res));
router.post('/notificaciones', verifyToken, (req, res) => dashboardController.crearNotificacion(req, res));

export default router;