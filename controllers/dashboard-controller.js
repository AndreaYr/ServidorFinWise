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

      // Ajustar la respuesta para incluir los datos necesarios para el frontend
      res.json({
        message: successMessage,
        success: true, // Indica que la operación fue exitosa
        data, // Devuelve los datos procesados por el servicio
      });
    } catch (error) {
      console.error(`Error en ${successMessage.toLowerCase()}:`, error);

      // Ajustar la respuesta de error para que el frontend pueda manejarla correctamente
      res.status(500).json({
        message: `Error en ${successMessage.toLowerCase()}`,
        success: false, // Indica que la operación falló
        error: error.message, // Devuelve el mensaje de error
      });
    }
  }

  // Obtener datos del dashboard
  // Método para obtener los datos del dashboard
async getData(req, res) {
  try {
    const userId = req.user.id; // Asumiendo que el userId está disponible en req.user
    console.log('ID del usuario desde el req:', userId); // Agregar log para verificar el userId

    // Llamamos al servicio para obtener todos los datos del usuario
    const data = await this.dashboardService.getData(userId);
    
    // Verificamos si los datos están disponibles
    if (!data) {
      return res.status(404).json({ message: 'No se encontraron datos para el usuario' });
    }

    // Devolvemos los datos como JSON
   
    const nombreUsuario = data.nombreUsuario; // Asumiendo que el nombre de usuario está en los datos
    console.log('Nombre de usuario:', nombreUsuario); // Agregar log para verificar el nombre de usuario
    res.json({ 
      message: 'Datos del dashboard obtenidos exitosamente', 
      data 
    });

  } catch (error) {
    console.error('Error al obtener los datos del dashboard:', error);
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
    const { id: meta_id } = req.body; // Asegurarse de extraer correctamente el ID
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
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ message: 'El ID del planificador es requerido para eliminarlo.' });
      }
      await this.handleRequest(req, res, (userId) => this.dashboardService.deleteExpensePlanner(userId, id), 'Planificador de gastos eliminado exitosamente');
    } catch (error) {
      console.error('Error en deleteExpensePlanner:', error);
      res.status(500).json({ message: 'Error al eliminar el planificador', error: error.message });
    }
  }

  // metodo para modificar un planificador
  async modifyExpensePlanner(req, res) {
    const { id, ...plannerData } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'El ID del planificador es requerido para modificarlo.' });
    }
    await this.handleRequest(req, res, (userId) => this.dashboardService.modifyExpensePlanner(userId, id, plannerData), 'Planificador de gastos modificado exitosamente');
  }

  //---------------------------------CATEGORÍAS-----------------------------------//
  // Método para añadir una categoría
  async addCategory(req, res) {
    const categoryData = req.body;
    await this.handleRequest(req, res, (userId) => this.dashboardService.addCategory(userId, categoryData), 'Categoría añadida exitosamente');
  }

  // Método para modificar una categoría
  async modifyCategory(req, res) {
    try {
        const { id, nombre, tipo, icono, color } = req.body;

        // Validar que los campos obligatorios estén presentes
        if (!id) {
            return res.status(400).json({ message: 'Los campos id y tipo son obligatorios.' });
        }

        const data = {
            id,
            nombre,
            tipo,
            icono, // Manejar icono como opcional
            color, // Manejar color como opcional
            usuario_id: req.user.id, // Asegurar que el usuario autenticado se asigne correctamente
        };

        const result = await this.dashboardService.modifyCategory(data);
        res.json({ message: 'Categoría modificada exitosamente', data: result });
    } catch (error) {
        console.error('Error en categoría modificada exitosamente:', error);
        res.status(500).json({ message: 'Error al modificar la categoría', error: error.message });
    }
  }

  // Método para eliminar una categoría
  async deleteCategory(req, res) {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'El ID de la categoría es requerido para eliminarla.' });
    }
    await this.handleRequest(req, res, () => this.dashboardService.deleteCategory(id), 'Categoría eliminada exitosamente');
  }

  // Método para obtener categorías
  async getCategorias(req, res) {
    try {
      const { tipo } = req.query;
      const categories = await this.dashboardService.getCategorias(tipo);
     
      const dataCategorias = categories.map(cat => cat.dataValues);

      res.json({ message: 'Categorías recuperadas exitosamente controllers', data: dataCategorias });
    } catch (error) {
      console.error('Error al recuperar las categorías:', error);
      res.status(500).json({ message: 'Error al recuperar las categorías' });
    }
  }

    //--------------------------------RECORDATORIOS-----------------------------------//
    // Método para añadir un recordatorio
    async addReminder(req, res) {
      const reminderData = req.body;

      if (!reminderData.nombre || !reminderData.nombre.trim()) {
        return res.status(400).json({ message: 'El nombre del recordatorio no puede estar vacío.' });
      }

      try {
        const data = await this.dashboardService.addReminder(req.user.id, reminderData);
        res.status(200).json({ message: 'Recordatorio añadido exitosamente', recordatorio: data });
      } catch (error) {
        console.error('Error al añadir el recordatorio:', error);
        res.status(500).json({ message: 'Error al añadir el recordatorio' });
      }
    }
    
    // Método para eliminar un recordatorio
    async deleteReminder(req, res) {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ message: 'El ID del recordatorio es requerido para eliminarlo.' });
      }
      await this.handleRequest(req, res, (userId) => this.dashboardService.deleteReminder(userId, id), 'Recordatorio eliminado exitosamente');
    }

    // Método para modificar un recordatorio
    async modifyReminder(req, res) {
      const { id, ...reminderData } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'El ID del recordatorio es requerido para modificarlo.' });
      }

      try {
        const data = await this.dashboardService.modifyReminder(req.user.id, id, reminderData);
        res.status(200).json({ message: 'Recordatorio modificado exitosamente', recordatorio: data });
      } catch (error) {
        console.error('Error al modificar el recordatorio:', error);
        res.status(500).json({ message: 'Error al modificar el recordatorio' });
      }
    }

  
  // Método para hacer una pregunta a la IA mediante el chatbot
  async askAI(req, res) {
    try {
      const { question } = req.body;
      const userId = req.user.id; // Asumiendo que el userId está disponible en req.user

      if (!question || question.trim() === '') {
        return res.status(400).json({ error: 'La pregunta es requerida.' });
      }

      const response = await this.dashboardService.askAI(userId, question);
      return res.status(200).json({ response });
    } catch (error) {
      console.error('Error al procesar la pregunta:', error);
      return res.status(500).json({ message: 'Error al procesar la pregunta', error: error.message });
    }
  }

  // Método para obtener el historial de conversaciones del usuario con la IA
  async getChatHistory(req) {
    try {
      const userId = req.user.id; // Asumiendo que el userId está disponible en req.user
      const chatHistory = await this.dashboardService.getChatHistory(userId);
      res.json({ message: 'Historial de chat recuperado exitosamente', data: chatHistory });
    } catch (error) {
      console.error('Error al recuperar el historial de chat:', error);
      res.status(500).json({ message: 'Error al recuperar el historial de chat' });
    }
  }

  //--------------------------------NOTIFICACIONES-----------------------------------//
  async getNotificaciones(req, res) {
    try {
      const userId = req.user.id;
      const notificaciones = await this.dashboardService.getNotificaciones(userId);
      res.json({ message: 'Notificaciones obtenidas exitosamente', notificaciones });
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      res.status(500).json({ message: 'Error al obtener notificaciones' });
    }
  }

  async marcarNotificacionesLeidas(req, res) {
    try {
      const userId = req.user.id;
      await this.dashboardService.marcarNotificacionesLeidas(userId);
      res.json({ message: 'Notificaciones marcadas como leídas' });
    } catch (error) {
      console.error('Error al marcar notificaciones como leídas:', error);
      res.status(500).json({ message: 'Error al marcar notificaciones como leídas' });
    }
  }

  async crearNotificacion(req, res) {
    try {
      const userId = req.user.id;
      const { mensaje } = req.body;

      if (!mensaje || mensaje.trim() === '') {
        return res.status(400).json({ message: 'El mensaje de la notificación no puede estar vacío.' });
      }

      const notificacion = await this.dashboardService.crearNotificacion(userId, mensaje);
      res.status(200).json({ message: 'Notificación creada exitosamente', notificacion });
    } catch (error) {
      console.error('Error al crear notificación:', error);
      res.status(500).json({ message: 'Error al crear notificación' });
    }
  }
}

export default DashboardController;
