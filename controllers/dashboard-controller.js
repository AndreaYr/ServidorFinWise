import DashboardService from '../services/dashboard-service.js';
import fetch from 'node-fetch';

class DashboardController {
  constructor() {
    this.dashboardService = new DashboardService();
  }

  // Método genérico para manejar solicitudes
  async handleRequest(req, res, serviceMethod, successMessage) {
    try {
      const userId = req.user.id; // Asumiendo que el userId está disponible en req.user
      const data = await serviceMethod(userId, req.body);
      res.json({ message: successMessage, data });
    } catch (error) {
      console.error(`Error en ${successMessage.toLowerCase()}:`, error); // Agregar log para verificar el error
      res.status(500).json({ message: `${successMessage.toLowerCase()}` });
    }
  }

  // Obtener datos del dashboard
  async getData(req, res) {
    try {
      const userId = req.user.id; // Asumiendo que el userId está disponible en req.user
      console.log('ID del usuario desde el req:', userId); // Agregar log para verificar el userId
      const data = await this.dashboardService.getData(userId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los datos' });
    }
  }

//---------------------------------------------TRANSACCIONES-----------------------------------//
  // Añadir una transacción
  async addTransaction(req, res) {
    const transactionData = req.body;
    await this.handleRequest(req, res, (userId) => this.dashboardService.addTransaction(userId, transactionData), 'Transacción añadida exitosamente');
  }

  // Eliminar una transacción
  async deleteTransaction(req, res) {
    const { transactionId } = req.body;
    if (!transactionId) {
      return res.status(400).json({ message: 'El ID de la transacción es requerido para eliminarla.' });
    }
    await this.handleRequest(req, res, (userId) => this.dashboardService.deleteTransaction(userId, transactionId), 'Transacción eliminada exitosamente');
  }

  // Modificar una transacción
  async modifyTransaction(req, res) {
    const { transactionId, ...transactionData } = req.body;
    if (!transactionId) {
      return res.status(400).json({ message: 'El ID de la transacción es requerido para modificarla.' });
    }
    await this.handleRequest(req, res, (userId) => this.dashboardService.modifyTransaction(userId, transactionId, transactionData), 'Transacción modificada exitosamente');
  }

  //---------------------------------META DE AHORRO-----------------------------------//
  // metodo para añadir una meta de ahorro

  async addGoal(req, res) {
    const goalData = req.body;
    await this.handleRequest(req, res, (userId) => this.dashboardService.addGoal(userId, goalData), 'Meta de ahorro añadida exitosamente');
  }

  // metodo para eliminar una meta de ahorro

  async deleteGoal(req, res) {
    const { meta_id } = req.body; // Cambiado de 'goalId' a 'meta_id'
    if (!meta_id) {
      console.log('El ID de la meta de ahorro no fue proporcionado.'); // Registro de depuración
      return res.status(400).json({ message: 'El ID de la meta de ahorro es requerido para eliminarla.' });
    }
    try {
      console.log('Llamando al servicio con meta_id:', meta_id, 'userId:', req.user.id); // Registro de depuración
      const userId = req.user.id;

      // Llamada directa al servicio para depuración
      const result = await this.dashboardService.deleteGoal(userId, meta_id);
      console.log('Resultado del servicio:', result); // Registro de depuración

      res.json({ message: 'Meta de ahorro eliminada exitosamente', data: result });
    } catch (error) {
      console.error('Error al eliminar la meta de ahorro:', error); // Registro de depuración
      res.status(500).json({ message: 'Error al eliminar la meta de ahorro', error: error.message });
    }
  }

  // metodo para modificar una meta de ahorro

  async modifyGoal(req, res) {
    const { meta_id, ...goalData } = req.body; // Asegúrate de que `meta_id` está siendo extraído
    if (!meta_id) {
      return res.status(400).json({ message: 'El ID de la meta de ahorro es requerido para modificarla.' });
    }
    await this.handleRequest(req, res, (userId) => this.dashboardService.modifyGoal(userId, meta_id, goalData), 'Meta de ahorro modificada exitosamente');
  }

//-------------------------------PLANIFICADOR-----------------------------------//
  // metodo para añadir un planificador
  async addExpensePlanner(req, res) {
    const plannerData = req.body;
    await this.handleRequest(req, res, (userId) => this.dashboardService.addExpensePlanner(userId, plannerData), 'Planificador de gastos añadido exitosamente');
  }

  // metodo para eliminar un planificador
  async deleteExpensePlanner(req, res) {
    const { plannerId } = req.body;
    if (!plannerId) {
      return res.status(400).json({ message: 'El ID del planificador es requerido para eliminarlo.' });
    }
    await this.handleRequest(req, res, (userId) => this.dashboardService.deleteExpensePlanner(userId, plannerId), 'Planificador de gastos eliminado exitosamente');
  }

  // metodo para modificar un planificador
  async modifyExpensePlanner(req, res) {
    const { plannerId, ...plannerData } = req.body;
    if (!plannerId) {
      return res.status(400).json({ message: 'El ID del planificador es requerido para modificarlo.' });
    }
    await this.handleRequest(req, res, (userId) => this.dashboardService.modifyExpensePlanner(userId, plannerId, plannerData), 'Planificador de gastos modificado exitosamente');
  }

  //---------------------------------CATEGORÍAS-----------------------------------//
  // Método para añadir una categoría
  async addCategory(req, res) {
    const categoryData = req.body;
    await this.handleRequest(req, res, (userId) => this.dashboardService.addCategory(userId, categoryData), 'Categoría añadida exitosamente');
  }

  // Método para modificar una categoría
  async modifyCategory(req, res) {
    const { categoryId, ...categoryData } = req.body;
    if (!categoryId) {
      return res.status(400).json({ message: 'El ID de la categoría es requerido para modificarla.' });
    }
    await this.handleRequest(req, res, (userId) => this.dashboardService.modifyCategory(userId, categoryId, categoryData), 'Categoría modificada exitosamente');
  }

  // Método para eliminar una categoría
  async deleteCategory(req, res) {
    const { categoryId } = req.body;
    if (!categoryId) {
      return res.status(400).json({ message: 'El ID de la categoría es requerido para eliminarla.' });
    }
    await this.handleRequest(req, res, (userId) => this.dashboardService.deleteCategory(userId, categoryId), 'Categoría eliminada exitosamente');
  }

  // Método para hacer una pregunta a la IA mediante el chatbot
  async askAI(req, res) {

    const API_KEY = process.env.GEMINI_API_KEY;
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    const { question } = req.body;

    const body = {
      contents: [{ parts: [{ text: question }] }]
    };

    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  // Método para obtener el historial de conversaciones del usuario con la IA
  async getChatHistory(req, res) {
    try {
      const userId = req.user.id; // Asumiendo que el userId está disponible en req.user
      const chatHistory = await this.dashboardService.getChatHistory(userId);
      res.json({ message: 'Historial de chat recuperado exitosamente', data: chatHistory });
    } catch (error) {
      console.error('Error al recuperar el historial de chat:', error);
      res.status(500).json({ message: 'Error al recuperar el historial de chat' });
    }
  }
}

export default DashboardController;
