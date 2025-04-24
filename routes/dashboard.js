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
//import validationIA from '../middleware/ia-validator.js';

const router = express.Router();
const dashboardController = new DashboardController();

/* Asegurarse de que el usuario está autenticado antes de acceder a la ruta /data */
router.get('/data', (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Usuario no autenticado' });
  }
  next();
}, (req, res) => dashboardController.getData(req, res));


// Rutas para manejar transacciones
router.post('/addTransactions', (req, res) => dashboardController.addTransaction(req, res));
router.delete('/deleteTransactions', (req, res) => dashboardController.deleteTransaction(req, res));
router.put('/modifyTransactions',(req, res) => dashboardController.modifyTransaction(req, res));

// Rutas para manejar metas de ahorro
router.post('/addGoal',  (req, res) => dashboardController.addGoal(req, res));
router.delete('/deleteGoal', (req, res) => {
  console.log('Middleware global - Cuerpo recibido:', req.body); // Registro de depuración
  dashboardController.deleteGoal(req, res);
});
router.put('/modifyGoal', (req, res) => dashboardController.modifyGoal(req, res));

//Ruta para manejar el planificador
router.post('/addExpensePlanner', (req, res) => dashboardController.addExpensePlanner(req, res));
router.delete('/deleteExpensePlanner', (req, res) => dashboardController.deleteExpensePlanner(req, res)); 
router.put('/modifyExpensePlanner', (req, res) => dashboardController.modifyExpensePlanner(req, res));

// Rutas para manejar categorías
router.post('/addCategory',(req, res) => dashboardController.addCategory(req, res));
router.put('/modifyCategory', (req, res) => dashboardController.modifyCategory(req, res));
router.delete('/deleteCategory', (req, res) => dashboardController.deleteCategory(req, res));
router.get('/getCategory', (req, res) => dashboardController.getCategorias(req, res));

// Ruta para manejar preguntas del usuario mediante el modelo de IA
router.post('/askAI', (req, res) => dashboardController.askAI(req, res));
 

// Ruta para obtener el historial de conversaciones del usuario con la IA
router.get('/chatHistory', (req, res) => dashboardController.getChatHistory(req, res));

export default router;