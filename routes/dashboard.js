import express from 'express';
import DashboardController from '../controllers/dashboard-controller.js';
import validatorAddTransactions from '../middleware/addTransactions-validator.js';
import validatorDeleteTransactions from '../middleware/deleteTransaction-validator.js';
import validatorModifyTransactions from '../middleware/modifyTransactions-validator.js';

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
router.post('/addTransactions', validatorAddTransactions.validatorParams, validatorAddTransactions.validator, (req, res) => dashboardController.addTransaction(req, res));
router.delete('/deleteTransactions', validatorDeleteTransactions.validatorParams, validatorDeleteTransactions.validator, (req, res) => dashboardController.deleteTransaction(req, res));
router.put('/modifyTransactions', validatorModifyTransactions.validatorParams, validatorModifyTransactions.validator, (req, res) => dashboardController.modifyTransaction(req, res));

// Rutas para manejar metas de ahorro
router.post('/addGoal', (req, res) => dashboardController.addGoal(req, res));
router.delete('/deleteGoal', (req, res) => dashboardController.deleteGoal(req, res));
router.put('/modifyGoal', (req, res) => dashboardController.modifyGoal(req, res));

// Ruta para manejar recordatorios
router.post('/addReminder', (req, res) => dashboardController.addReminder(req, res));
router.delete('/deleteReminder', (req, res) => dashboardController.deleteReminder(req, res));
router.put('/modifyReminder', (req, res) => dashboardController.modifyReminder(req, res));

//Ruta para manejar el planificador
router.post('/addExpensePlanner', (req, res) => dashboardController.addExpensePlanner(req, res));
router.delete('/deleteExpensePlanner', (req, res) => dashboardController.deleteExpensePlanner(req, res)); 
router.put('/modifyExpensePlanner', (req, res) => dashboardController.modifyExpensePlanner(req, res));

// Ruta para manejar preguntas del usuario mediante el modelo de IA
router.post('/askAI', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ message: 'La pregunta es requerida' });
  }

  try {
    const response = await dashboardController.askAI(req, res);
    res.json({ answer: response });
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar la pregunta', error: error.message });
  }
});


export default router;