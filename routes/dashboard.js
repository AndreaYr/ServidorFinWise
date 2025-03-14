import express from 'express';
import DashboardController from '../controllers/dashboard-controller.js';

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
router.post('/modifyTransactions', (req, res) => dashboardController.modifyTransaction(req, res));
// Rutas para manejar metas de ahorro
router.post('/addGoal', (req, res) => dashboardController.addGoal(req, res));
router.delete('/deleteGoal', (req, res) => dashboardController.deleteGoal(req, res));
router.post('/modifyGoal', (req, res) => dashboardController.modifyGoal(req, res));

export default router;