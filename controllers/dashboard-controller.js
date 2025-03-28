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

  // metodo para añadir una meta de ahorro

  async addGoal(req, res) {
    const goalData = req.body;
    await this.handleRequest(req, res, (userId) => this.dashboardService.addGoal(userId, goalData), 'Meta de ahorro añadida exitosamente');
  }

  // metodo para eliminar una meta de ahorro

  async deleteGoal(req, res) {
    const { goalId } = req.body;
    if (!goalId) {
      return res.status(400).json({ message: 'El ID de la meta de ahorro es requerido para eliminarla.' });
    }
    await this.handleRequest(req, res, (userId) => this.dashboardService.deleteGoal(userId, goalId), 'Meta de ahorro eliminada exitosamente');
  }

  // metodo para modificar una meta de ahorro

  async modifyGoal(req, res) {
    const { goalId, ...goalData } = req.body;
    if (!goalId) {
      return res.status(400).json({ message: 'El ID de la meta de ahorro es requerido para modificarla.' });
    }
    await this.handleRequest(req, res, (userId) => this.dashboardService.modifyGoal(userId, goalId, goalData), 'Meta de ahorro modificada exitosamente');
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
  
}

export default DashboardController;
