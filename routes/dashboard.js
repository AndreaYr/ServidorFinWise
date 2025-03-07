import express from 'express';
import DashboardController from '../controllers/dashboard-controller.js';

const router = express.Router();
const dashboardController = new DashboardController();

router.get('/data', (req, res) => dashboardController.getData(req, res));

export default router;