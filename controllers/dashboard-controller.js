import DashboardService from '../services/dashboard-service.js';

class DashboardController {
  constructor() {
    this.dashboardService = new DashboardService();
  }

  async getData(req, res) {
    try {
      const data = await this.dashboardService.getData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los datos' });
    }
  }
}

export default DashboardController;
