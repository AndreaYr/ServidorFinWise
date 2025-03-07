import DashboardRepository from '../repositories/dashboard-repository.js';

class DashboardService {
  constructor() {
    this.dashboardRepository = new DashboardRepository();
  }

  async getData() {
    const data = await this.dashboardRepository.fetchData();
    console.log('Data:', data);
    return data;
  }
}

export default DashboardService;
