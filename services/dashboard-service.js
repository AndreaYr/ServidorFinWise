import DashboardRepository from '../repositories/dashboard-repository.js';

class DashboardService {
  constructor() {
    this.dashboardRepository = new DashboardRepository();
  }

  async getData() {
    const data = await this.dashboardRepository.fetchData();
    return data;
  }
}

export default DashboardService;
