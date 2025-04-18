import Transacciones from '../dto/transacciones.js';
import MetaAhorro from '../dto/metas_ahorro.js';
import ChatBot from '../dto/chatBot.js';
import Planner from '../dto/planificador.js';
import Planificador from '../dto/recordatorios.js';
import Usuario from '../dto/usuario.js';
import Reminder from '../dto/recordatorios.js';
import logSystem from '../dto/logs_sistema.js';
import Categoria from '../dto/categoria.js';

class DashboardRepository {
  // Obtener datos del usuario
  async fetchData(userId) {
    try {
      console.log('Buscando datos del usuario en la capa repositorio:', userId);

      const [
        resumenFinanzas,
        metas,
        recordatorios,
        planificador,
        historialChat,
        usuario
      ] = await Promise.all([
        this.getResumenFinanciero(userId),
        MetaAhorro.findAll({ where: { usuario_id: userId } }),
        Reminder.findAll({ where: { usuario_id: userId } }),
        Planificador.findAll({ where: { usuario_id: userId } }),
        this.getChatHistory(userId),
        Usuario.findByPk(Number (userId), { attributes: ['nombre'] }),  // Aquí debe ir la llamada a la base de datos
       
      ]);
      
      console.log('Usuario encontrado:', usuario)
      return {
        resumenFinanzas,
        metas,
        recordatorios,
        planificador,
        historialChat,
        nombreUsuario: usuario?.nombre || 'Usuario'
        
      };
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      throw new Error('Error interno del servidor');
    }
  }

  // Simulación de resumen financiero — puedes modificar esta lógica
  async getResumenFinanciero(userId) {
    const transacciones = await Transacciones.findAll({ where: { usuario_id: userId } });

    const ingresos = transacciones.filter(t => t.tipo === 'ingreso').reduce((sum, t) => sum + t.monto, 0);
    const egresos = transacciones.filter(t => t.tipo === 'egreso').reduce((sum, t) => sum + t.monto, 0);

    return {
      transacciones: transacciones,
      totalIngresos: ingresos,
      totalEgresos: egresos,
      balance: ingresos - egresos
    };
  }

  async getChatHistory(userId) {
    return await ChatBot.findAll({
      where: { usuario_id: userId },
      order: [['id', 'ASC']],
    });
  }
  

  // Añadir una transacción
  async addTransaction(userId, transactionData) {
    await this.saveTransaction(userId, transactionData);
  }

  // Eliminar una transacción
  async deleteTransaction(userId, transactionId) {
    if (!transactionId) {
      throw new Error('El ID de la transacción es requerido para eliminarla.');
    }
    console.log('Eliminando transacción con ID:', transactionId);
    await Transaction.destroy({
      where: {
        id: transactionId,
        usuario_id: userId
      }
    });
  }

  // Modificar una transacción
  async modifyTransaction(userId, transactionId, transactionData) {
    await this.saveTransaction(userId, transactionData, transactionId);
  }

  //-------------------------------Metas de ahorro--------------------------------
  // Guardar una meta de ahorro (crear o modificar)
  async saveGoal(userId, goalData, goalId = null) {
    const data = {
      usuario_id: userId,
      ...goalData
    };
    console.log('Datos a guardar en la meta de ahorro:', data);

    if (goalId) {
      await Goal.update(data, {
        where: {
          meta_id: goalId, // Asegurarse de que el nombre de la columna es correcto
          usuario_id: userId
        }
      });
    } else {
      await Goal.create(data);
    }
  }

  // Añadir una meta de ahorro
  async addGoal(userId, goalData) {
    await this.saveGoal(userId, goalData);
  }

  // Eliminar una meta de ahorro
  async deleteGoal(userId, goalId) {
    if (!goalId) {
      console.log('repo', goalId); // Registro de depuración
      throw new Error('El ID de la meta de ahorro es requerido para eliminarla.');
    }
    console.log('Intentando eliminar meta de ahorro con ID:', goalId, 'para usuario:', userId); // Registro de depuración

    try {
      const result = await Goal.destroy({
        where: {
          meta_id: goalId, // Asegúrate de que coincide con el esquema de la base de datos
          usuario_id: userId
        }
      });
      console.log('Resultado de la eliminación en el repositorio:', result); // Registro de depuración
      if (result === 0) {
        throw new Error('No se encontró la meta de ahorro para eliminar.');
      }
      return result;
    } catch (error) {
      console.error('Error al intentar eliminar la meta de ahorro:', error); // Registro de depuración
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new Error('No se puede eliminar la meta debido a restricciones de clave foránea.');
      }
      throw new Error('Error al eliminar la meta de ahorro. Verifique las restricciones de la base de datos.');
    }
  }

  // Modificar una meta de ahorro
  async modifyGoal(userId, goalId, goalData){
    await this.saveGoal(userId,goalData,goalId);
  }

  //-------------------------------Recordatorios--------------------------------
  // Guardar un recordatorio (crear o modificar)
  async saveReminder(userId, reminderData, reminderId = null) {
    const data = {
      usuario_id: userId,
      ...reminderData
    };
    console.log('Datos a guardar en el recordatorio:', data);

    if (reminderId) {
      await Reminder.update(data, {
        where: {
          id: reminderId,
          usuario_id: userId
        }
      });
    } else {
      await Reminder.create(data);
    }
  }   

  // Añadir un recordatorio
  async addReminder(userId, reminderData) {
    await this.saveReminder(userId, reminderData);
  }

  // Eliminar un recordatorio
  async deleteReminder(userId, reminderId) {
    if (!reminderId) {
      throw new Error('El ID del recordatorio es requerido para eliminarlo.');
    }
    console.log('Eliminando recordatorio con ID:', reminderId);
    await Reminder.destroy({
      where: {
        id: reminderId,
        usuario_id: userId
      }
    });
  }

  // Modificar un recordatorio
  async modifyReminder(userId, reminderId, reminderData) {
    await this.saveReminder(userId, reminderData, reminderId);
  }

  //-------------------------------Planificador--------------------------------
  // Guardar un planificador (crear o modificar)
  async savePlanner(userId, plannerData, plannerId = null) {
    const data = {
      usuario_id: userId,
      ...plannerData
    };
    console.log('Datos a guardar en el planificador:', data);

    if (plannerId) {
      await Planner.update(data, {
        where: {
          id: plannerId,
          usuario_id: userId
        }
      });
    } else {
      await Planner.create(data);
    }
  }

  // Añadir un planificador
  async addExpensePlanner(userId, plannerData) {
    await this.savePlanner(userId, plannerData);
  }

  // Eliminar un planificador
  async deleteExpensePlanner(userId, plannerId) {
    if (!plannerId) {
      throw new Error('El ID del planificador es requerido para eliminarlo.');
    }
    console.log('Eliminando planificador con ID:', plannerId);
    await Planner.destroy({
      where: {
        id: plannerId,
        usuario_id: userId
      }
    });
  }

  // Modificar un planificador
  async modifyExpensePlanner(userId, plannerId, plannerData) {
    await this.savePlanner(userId, plannerData, plannerId);
  }

  //-------------------------------Categorías--------------------------------
  // Guardar una categoría (crear o modificar)
  async saveCategory(userId, categoryData, categoryId = null) {
    const data = {
      usuario_id: userId,
      ...categoryData
    };
    console.log('Datos a guardar en la categoría:', data);

    if (categoryId) {
      await Categoria.update(data, {
        where: {
          id: categoryId,
          usuario_id: userId
        }
      });
    } else {
      await Categoria.create(data);
    }
  }

  // Añadir una categoría
  async addCategory(userId, categoryData) {
    await this.saveCategory(userId, categoryData);
  }

  // Modificar una categoría
  async modifyCategory(userId, categoryId, categoryData) {
    await this.saveCategory(userId, categoryData, categoryId);
  }

  // Eliminar una categoría
  async deleteCategory(userId, categoryId) {
    if (!categoryId) {
      throw new Error('El ID de la categoría es requerido para eliminarla.');
    }
    console.log('Eliminando categoría con ID:', categoryId);
    await Categoria.destroy({
      where: {
        id: categoryId,
        usuario_id: userId
      }
    });
  }
  
  // Obtener categorías
  async getCategorias(tipo) {
    const where = {};

    if (tipo) {
      where.tipo = tipo.toLowerCase(); // Asegura que sea 'ingreso' o 'egreso'
    }
  
    const categories = await Categoria.findAll({
      where,
      order: [['id', 'ASC']]
    });
  
    return categories;
  }
  
  //-------------------------------Historial de chat--------------------------------
  // Obtener el historial de conversaciones del usuario con la IA
  async getChatHistory(userId) {
    const chatHistory = await ChatBot.findAll({
      where: { usuario_id: userId },
      order: [['id', 'ASC']], // Ordenar por ID para mostrar en orden cronológico
    });
    return chatHistory;
  }
}

export default DashboardRepository;
