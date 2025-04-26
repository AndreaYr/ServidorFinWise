import DashboardRepository from '../repositories/dashboard-repository.js';

class DashboardService {
  constructor() {
    this.dashboardRepository = new DashboardRepository();
  }

  async getData(userId) {
    return await this.dashboardRepository.fetchData(userId);
  }

  async addTransaction(userId, transactionData) {
    return await this.dashboardRepository.addTransaction(userId, transactionData);
  }

  async deleteTransaction(userId, transactionId) {
    return await this.dashboardRepository.deleteTransaction(userId, transactionId);
  }

  async modifyTransaction(userId, transactionId, transactionData) {
    return await this.dashboardRepository.modifyTransaction(userId, transactionId, transactionData);
  }

  async addGoal(userId, goalData) {
    return await this.dashboardRepository.addGoal(userId, goalData);
  }

  async deleteGoal(userId, goalId) {
    return await this.dashboardRepository.deleteGoal(userId, goalId);
  }

  async modifyGoal(userId, goalId, goalData) {
    return await this.dashboardRepository.modifyGoal(userId, goalId, goalData);
  }

  async addExpensePlanner(userId, plannerData) {
    return await this.dashboardRepository.addExpensePlanner(userId, plannerData);
  }

  async deleteExpensePlanner(userId, plannerId) {
    return await this.dashboardRepository.deleteExpensePlanner(userId, plannerId);
  }

  async modifyExpensePlanner(userId, plannerId, plannerData) {
    return await this.dashboardRepository.modifyExpensePlanner(userId, plannerId, plannerData);
  }

  async addCategory(userId, categoryData) {
    return await this.dashboardRepository.addCategory(userId, categoryData);
  }

  async deleteCategory(categoryId) {
    return await this.dashboardRepository.deleteCategory(categoryId);
  }

  async modifyCategory(categoryData) {
    return await this.dashboardRepository.modifyCategory(categoryData);
  }

  async getCategorias(tipo) {
    return await this.dashboardRepository.getCategorias(tipo);
  }

  async addReminder(userId, reminderData) {
    return await this.dashboardRepository.addReminder(userId, reminderData);
  }

  async deleteReminder(userId, reminderId) {
    return await this.dashboardRepository.deleteReminder(userId, reminderId);
  }

  async modifyReminder(userId, reminderId, reminderData) {
    return await this.dashboardRepository.modifyReminder(userId, reminderId, reminderData);
  }

  async askAI(userId, question) {
    return await this.dashboardRepository.askAI(userId, question);
  }

  async getChatHistory(userId) {
    return await this.dashboardRepository.getChatHistory(userId);
  }

  async getNotificaciones(userId) {
    return await this.dashboardRepository.getNotificaciones(userId);
  }

  async marcarNotificacionesLeidas(userId) {
    return await this.dashboardRepository.marcarNotificacionesLeidas(userId);
  }

  async crearNotificacion(userId, mensaje) {
    return await this.dashboardRepository.crearNotificacion(userId, mensaje);
  }
}

export default DashboardService;
