import Transaction from '../dto/transacciones.js';
import Goal from '../dto/metas_ahorro.js';
import ChatBot from '../dto/chatBot.js';
import Planner from '../dto/planificador.js';
import Reminder from '../dto/recordatorios.js';
import logSystem from '../dto/logs_sistema.js';

class DashboardRepository {
  // Obtener datos del usuario
  async fetchData(userId) {
    const transactions = await Transaction.findAll({
      where: { usuario_id: userId }
    });

    const data = {
      recentActivities: transactions.map(transaction => ({
        activity: `Usuario ${transaction.usuario_id} hizo un ${transaction.tipo} de ${transaction.monto}`
      })),
      totalIncomes: transactions
        .filter(transaction => transaction.tipo === 'ingreso')
        .reduce((total, transaction) => total + parseFloat(transaction.monto), 0)
        .toFixed(2),
      totalExpenses: transactions
        .filter(transaction => transaction.tipo === 'gasto')
        .reduce((total, transaction) => total + parseFloat(transaction.monto), 0)
        .toFixed(2),
    };
    console.log('Datos obtenidos:', data);

    return data;
  }

  // Guardar una transacción (crear o modificar)
  async saveTransaction(userId, transactionData, transactionId = null) {
    const data = {
      usuario_id: userId,
      ...transactionData
    };
    console.log('Datos a guardar en la transacción:', data);

    if (transactionId) {
      await Transaction.update(data, {
        where: {
          id: transactionId,
          usuario_id: userId
        }
      });
    } else {
      await Transaction.create(data);
    }
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
