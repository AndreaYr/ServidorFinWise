import DashboardRepository from '../repositories/dashboard-repository.js';

class DashboardService {
  constructor() {
    this.dashboardRepository = new DashboardRepository();
  }

  // Obtener datos del usuario
  async getData(userId) {
    console.log('Buscando datos del usuario:', userId);
    const data = await this.dashboardRepository.fetchData(userId);
    return data;
  }

  // Añadir una transacción
  async addTransaction(userId, transactionData) {
    const data = await this.dashboardRepository.addTransaction(userId, transactionData);
    return data;
  }

  // Eliminar una transacción
  async deleteTransaction(userId, transactionId) {
    await this.dashboardRepository.deleteTransaction(userId, transactionId);
  }

  // Modificar una transacción
  async modifyTransaction(userId, transactionId, transactionData) {
    const data = await this.dashboardRepository.modifyTransaction(userId, transactionId, transactionData);
    return data;
  }

  //------------------------Metas de ahorro-----------------------------------

  // Añadir una meta de ahorro
  async addGoal(userId, goalData) {
    const data = await this.dashboardRepository.addGoal(userId, goalData);
    return data;
  }

  // Eliminar una meta de ahorro
  async deleteGoal(userId, goalId) {
    await this.dashboardRepository.deleteGoal(userId, goalId);
  }

  // Modificar una meta de ahorro
  async modifyGoal(userId, goalId, goalData) {
    const data = await this.dashboardRepository.modifyGoal(userId, goalId, goalData);
    return data;
  }
}

export default DashboardService;
