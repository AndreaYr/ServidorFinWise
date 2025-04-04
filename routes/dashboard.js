import express from 'express';
import DashboardController from '../controllers/dashboard-controller.js';
import validatorAddTransactions from '../middleware/addTransactions-validator.js';
import validatorDeleteTransactions from '../middleware/deleteTransaction-validator.js';
import validatorModifyTransactions from '../middleware/modifyTransactions-validator.js';
import validatorAddGoal from '../middleware/addGoal-validator.js';
import validatorDeleteGoal from '../middleware/deleteGoal-validator.js';
import validatorModifyGoal from '../middleware/modifyGoal-validator.js';

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
router.post('/addGoal', validatorAddGoal.validatorParams, validatorAddGoal.validator, (req, res) => dashboardController.addGoal(req, res));
router.delete('/deleteGoal', validatorDeleteGoal.validatorParams, validatorDeleteGoal.validator, (req, res) => {dashboardController.deleteGoal(req, res);});
router.post('/modifyGoal', validatorModifyGoal.validatorParams, validatorModifyGoal.validator, (req, res) => dashboardController.modifyGoal(req, res));

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