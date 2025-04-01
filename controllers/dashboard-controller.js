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
    console.log('Cuerpo de la solicitud con:', req.body); // Registro de depuración

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
    const { goalId, ...goalData } = req.body;
    if (!goalId) {
      return res.status(400).json({ message: 'El ID de la meta de ahorro es requerido para modificarla.' });
    }
    await this.handleRequest(req, res, (userId) => this.dashboardService.modifyGoal(userId, goalId, goalData), 'Meta de ahorro modificada exitosamente');
  }

  //--------------------------------RECORDATORIO-----------------------------------//
  // metodo para añadir un recordatorio
  async addReminder(req, res) {
    const reminderData = req.body;
    await this.handleRequest(req, res, (userId) => this.dashboardService.addReminder(userId, reminderData), 'Recordatorio añadido exitosamente');
  }

  // metodo para eliminar un recordatorio
  async deleteReminder(req, res) {
    const { reminderId } = req.body;
    if (!reminderId) {
      return res.status(400).json({ message: 'El ID del recordatorio es requerido para eliminarlo.' });
    }
    await this.handleRequest(req, res, (userId) => this.dashboardService.deleteReminder(userId, reminderId), 'Recordatorio eliminado exitosamente');
  }

  // metodo para modificar un recordatorio
  async modifyReminder(req, res) {
    const { reminderId, ...reminderData } = req.body;
    if (!reminderId) {
      return res.status(400).json({ message: 'El ID del recordatorio es requerido para modificarlo.' });
    }
    await this.handleRequest(req, res, (userId) => this.dashboardService.modifyReminder(userId, reminderId, reminderData), 'Recordatorio modificado exitosamente');
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

  // Método para hacer una pregunta a la IA mediante el chatbot
  async askAI(req, res) {
    try{
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

    } catch (error) {
      console.error("Error en askAI:", error);
      res.status(500).json({ message: "Error al procesar la solicitud a Gemini API.", error: error.message });
    }
  }
}

export default DashboardController;
