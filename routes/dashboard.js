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
router.post('/transactions', (req, res) => dashboardController.addTransaction(req, res));
router.delete('/transactions', (req, res) => dashboardController.deleteTransaction(req, res));
router.post('/modify', (req, res) => dashboardController.modifyTransaction(req, res));

export default router;