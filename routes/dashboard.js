import express from 'express';
import DashboardController from '../controllers/dashboard-controller.js';

const router = express.Router();
const dashboardController = new DashboardController();

router.get('/data', dashboardController.getData);

export default router;