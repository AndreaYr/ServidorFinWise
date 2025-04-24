import DashboardRepository from '../repositories/dashboard-repository.js';

class DashboardService {
  constructor() {
    this.dashboardRepository = new DashboardRepository();
  }

  // Obtener datos del usuario
  async getData(userId) {
    console.log('Buscando datos del usuario:', userId);
    const data = await this.dashboardRepository.fetchData(userId);
    console.log('--- Resultado Procesado getResumenFinanciero ---:', JSON.stringify(data, null, 2)); // ¡Añade esto!
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
  async deleteGoal(userId, meta_id) { // Cambiado de 'goalId' a 'meta_id'
    console.log('Servicio: Eliminando meta con meta_id:', meta_id, 'userId:', userId); // Registro de depuración
    const result = await this.dashboardRepository.deleteGoal(userId, meta_id);
    console.log('Servicio: Resultado de la eliminación:', result); // Registro de depuración
    return result;
  }

  // Modificar una meta de ahorro
  async modifyGoal(userId, goalId, goalData) {
    const data = await this.dashboardRepository.modifyGoal(userId, goalId, goalData);
    return data;
  }

  //------------------------Planificador-----------------------------------
  // Añadir un planificador de gastos
  async addExpensePlanner(userId, plannerData) {
    const data = await this.dashboardRepository.addExpensePlanner(userId, plannerData);
    return data;
  }

  // Eliminar un planificador
  async deleteExpensePlanner(userId, plannerId) {
    await this.dashboardRepository.deleteExpensePlanner(userId, plannerId);
  }

  // Modificar un planificador
  async modifyExpensePlanner(userId, plannerId, plannerData) {
    const data = await this.dashboardRepository.modifyExpensePlanner(userId, plannerId, plannerData);
    return data;
  }

  //------------------------Categorías-----------------------------------
  // Añadir una categoría
  async addCategory(userId, categoryData) {
    const data = await this.dashboardRepository.addCategory(userId, categoryData);
    return data;
  }

  // Modificar una categoría
  async modifyCategory(id, categoryData) {
    const data = await this.dashboardRepository.modifyCategory(id, categoryData);
    return data;
  }

  // Eliminar una categoría
  async deleteCategory( id) {
    await this.dashboardRepository.deleteCategory(id);
  }

  // Obtener categorías
  async getCategorias(tipo) {
    const categories = await this.dashboardRepository.getCategorias(tipo);
    return categories;
  }

  //------------------------Historial de chat-----------------------------------

  async askAI(userId, question) {
    try{
      const answer = await this.dashboardRepository.askAI(question);
      console.log('Valor de question antes de guardar:', question);
      console.log('Valor de answer antes de guardar:', answer);
  
    await this.dashboardRepository.saveChat(userId, question, answer); // Guardar la pregunta y respuesta en el historial
    return answer
    }catch (error) {
      console.error('Error en askAI:', error);
      throw new Error('Error al obtener la respuesta de la IA: ' + error.message);
    }
    
  }

  // Obtener el historial de conversaciones del usuario con la IA
  async getChatHistory(userId) {
    const chatHistory = await this.dashboardRepository.getChatHistory(userId);
    return chatHistory;
  }
}

export default DashboardService;
