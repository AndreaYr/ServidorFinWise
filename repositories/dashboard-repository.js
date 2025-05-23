import Transacciones from '../dto/transacciones.js';
import MetaAhorro from '../dto/metas_ahorro.js';
import ChatBot from '../dto/chatBot.js';
import Planner from '../dto/planificador.js';
import Reminder from '../dto/recordatorios.js';
import Usuario from '../dto/usuario.js';
import Categoria from '../dto/categoria.js';
import Goal from '../dto/metas_ahorro.js'; // Agregar para metas de ahorro
import axios from 'axios'; // Asegúrate de tener axios instalado
import Notificaciones from '../dto/notificaciones.js';

class DashboardRepository {
  // Obtener datos del usuario
  async fetchData(userId) {
    try {
      console.log('Buscando datos del usuario en la capa repositorio:', userId);

      if (isNaN(Number(userId))) {
        throw new Error('ID de usuario inválido');
      }

      const [
        resumenFinanzas, 
        metas,
        recordatorios,
        planificador,
        historialChat, 
        usuario
      ] = await Promise.all([
        this.getResumenFinanciero(Number(userId)),
        MetaAhorro.findAll({ where: { usuario_id: Number(userId) } }),
        Reminder.findAll({ where: { usuario_id: Number(userId) } }),
        Planner.findAll({ where: { usuario_id: Number(userId) } }),
        Promise.resolve([]), 
        Usuario.findByPk(Number(userId), { attributes: ['nombre'] }),
      ]);

      const transacciones = await Transacciones.findAll({
        where: { usuario_id: Number(userId) },
        include: [
          {
            model: Categoria,
            attributes: ['id', 'nombre', 'icono'],
            as: 'Categoria',
          }
        ],
        order: [['fecha', 'DESC']],
      });

      console.log('Usuario encontrado:', usuario);
      return {
        resumenFinanzas,
        metas,
        recordatorios,
        planificador,
        historialChat,
        nombreUsuario: usuario?.nombre || 'Usuario',
        transacciones
      };
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      throw new Error('Error interno del servidor al obtener datos del dashboard.');
    }
  }

  // Función para obtener el resumen financiero
  async getResumenFinanciero(userIdNum) {
    try {
      const transacciones = await Transacciones.findAll({
        where: { usuario_id: userIdNum },
        include: [{
          model: Categoria, // Incluye el modelo Categoria
          attributes: ['id', 'nombre', 'icono'], // Atributos que deseas obtener
          as: 'Categoria', // Alias definido en el modelo Transacciones
          required: false
        }],
        order: [['fecha', 'ASC']]
      });
      //console.log('Transacciones obtenidas:', transacciones);
      const monthlyTotals = {};
      const categoryIncomeTotals = {};
      const categoryExpenseTotals = {};
      let totalIngresosGeneral = 0;
      let totalEgresosGeneral = 0;

      const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

      for (const t of transacciones) {
        const fecha = new Date(t.fecha);
        if (isNaN(fecha.getTime())) {
          console.warn(`Fecha inválida encontrada para transacción ID ${t.id}: ${t.fecha}`);
          continue;
        }

        const year = fecha.getFullYear();
        const month = fecha.getMonth();
        const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
        const monthName = monthNames[month];
        const montoNumerico = parseFloat(t.monto);

        if (isNaN(montoNumerico)) {
          console.warn(`Monto inválido encontrado para transacción ID ${t.id}: ${t.monto}. Saltando.`);
          continue;
        }

        if (!monthlyTotals[monthKey]) {
          monthlyTotals[monthKey] = { mesNombre: monthName, ingreso: 0, gasto: 0 };
        }

        //console.log('Transacción:', t.descripcion, '→ Categoría:', t.Categoria);

        const categoriaNombre = t.Categoria?.nombre || 'Sin Categoría';
        const categoriaIcono = t.Categoria?.icono || '❓';

        if (t.tipo === 'ingreso') {
          monthlyTotals[monthKey].ingreso += montoNumerico;
          totalIngresosGeneral += montoNumerico;

          if (!categoryIncomeTotals[categoriaNombre]) {
            categoryIncomeTotals[categoriaNombre] = { total: 0, 
              icono: categoriaIcono,
              categoria: t.Categoria }; // Agregamos la categoría explícitamente
          }
          categoryIncomeTotals[categoriaNombre].total += montoNumerico;

        } else if (t.tipo === 'gasto') {
          monthlyTotals[monthKey].gasto += montoNumerico;
          totalEgresosGeneral += montoNumerico;

          if (!categoryExpenseTotals[categoriaNombre]) {
            categoryExpenseTotals[categoriaNombre] = { total: 0, icono: categoriaIcono, categoria: t.Categoria }; // Agregamos la categoría explícitamente
          }
          categoryExpenseTotals[categoriaNombre].total += montoNumerico;
        }
      }

      const sortedMonthKeys = Object.keys(monthlyTotals).sort();

      const ingresosMensuales = sortedMonthKeys.map(key => ({
        mes: monthlyTotals[key].mesNombre,
        total: parseFloat(monthlyTotals[key].ingreso.toFixed(2)).toString()
      }));

      const gastosMensuales = sortedMonthKeys.map(key => ({
        mes: monthlyTotals[key].mesNombre,
        total: parseFloat(monthlyTotals[key].gasto.toFixed(2)).toString(),
      }));

      const resumenIngresos = Object.entries(categoryIncomeTotals).map(([nombre, data]) => ({
        id: nombre,
        label: `${data.icono} ${nombre}`,
        value: parseFloat(data.total.toFixed(2)).toString(),
        categoria: data.categoria, // Agregamos la categoría explícitamente
      }));

      const resumenGastos = Object.entries(categoryExpenseTotals).map(([nombre, data]) => ({
        id: nombre,
        label: `${data.icono} ${nombre}`,
        value: parseFloat(data.total.toFixed(2)).toString(),
        categoria: data.categoria // Ya estaba agregado
      }));

      return {
        ingresosMensuales,
        gastosMensuales,
        resumenIngresos,
        resumenGastos,
        totalIngresos: totalIngresosGeneral,
        totalEgresos: totalEgresosGeneral,
        balance: totalIngresosGeneral - totalEgresosGeneral,
      };

    } catch (error) {
      console.error('Error al calcular el resumen financiero:', error);
      return {
        ingresosMensuales: [],
        gastosMensuales: [],
        resumenIngresos: [],
        resumenGastos: [],
        totalIngresos: 0,
        totalEgresos: 0,
        balance: 0
      };
    }
  }

//-----------------------------------Transacciones--------------------------------
  // Guardar una transacción (crear o modificar)
  async saveTransaction(userId, transactionData, transactionId = null) {
    const data = {
      usuario_id: userId,
      ...transactionData
    };
    console.log('Datos a guardar en la transacción:', data);

    if (transactionId) {
      await Transacciones.update(data, {
        where: {
          id: transactionId,
          usuario_id: userId
        }
      });
    } else {
      await Transacciones.create(data);
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
      nombre: goalData.titulo, // Asegúrate de mapear correctamente el campo
      ...goalData,
    };
    console.log('Datos a guardar en la meta de ahorro:', data);

    if (goalId) {
      // Permitir solo la modificación del monto_actual
      await Goal.update({ monto_actual: data.monto_actual }, {
        where: {
          meta_id: goalId,
          usuario_id: userId
        }
      });
    } else {
      // Crear una nueva meta sin monto_actual
      const { monto_actual, ...newGoalData } = data;
      await Goal.create(newGoalData);
    }
  }

  // Añadir una meta de ahorro
  async addGoal(userId, goalData) {
    await this.saveGoal(userId, goalData);
  }

  // Eliminar una meta de ahorro
  async deleteGoal(userId, goalId) {
    if (!goalId) {
      console.log('ID de meta no proporcionado en el repositorio:', goalId); // Registro de depuración
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
    async addReminder(userId, reminderData) {
      const data = {
        usuario_id: userId,
        nombre: reminderData.nombre.trim(),
        estado: reminderData.estado || 'pendiente',
        fecha_inicio: reminderData.fecha_inicio,
        fecha_vencimiento: reminderData.fecha_vencimiento,
      };

      const recordatorio = await Reminder.create(data);
      return recordatorio;
    }

    // Modificar y luego buscar para devolver el recordatorio actualizado
    async modifyReminder(userId, reminderId, reminderData) {
      const data = {
        usuario_id: userId,
        nombre: reminderData.nombre.trim(),
        estado: reminderData.estado || 'pendiente',
        fecha_inicio: reminderData.fecha_inicio,
        fecha_vencimiento: reminderData.fecha_vencimiento,
      };

      // Actualizar el recordatorio en la base de datos
      await Reminder.update(data, {
        where: {
          id: reminderId,
          usuario_id: userId,
        },
      });

      // Retornar el recordatorio actualizado
      const recordatorioActualizado = await Reminder.findOne({
        where: {
          id: reminderId,
          usuario_id: userId,
        },
      });

      return recordatorioActualizado;
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
  async saveCategory(userId, categoryData, categoryId) {
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
  async modifyCategory(data) {
    try {
        const { id, nombre, tipo, usuario_id, icono, color } = data;

        // Buscar la categoría existente por ID
        const categoria = await Categoria.findOne({ where: { id } });

        if (!categoria) {
            throw new Error(`La categoría con ID ${id} no existe.`);
        }

        // Actualizar los campos de la categoría
        categoria.nombre = nombre || categoria.nombre;
        categoria.tipo = tipo || categoria.tipo;
        categoria.usuario_id = usuario_id || categoria.usuario_id;
        categoria.icono = icono || categoria.icono;
        categoria.color = color || categoria.color;

        // Guardar los cambios
        await categoria.save();

        return categoria;
    } catch (error) {
        console.error('Error al modificar la categoría:', error);
        throw error;
    }
  }

  // Eliminar una categoría
  async deleteCategory(categoryId) {
    if (!categoryId) {
      throw new Error('El ID de la categoría es requerido para eliminarla.');
    }
    console.log('Eliminando categoría con ID:', categoryId);
    await Categoria.destroy({
      where: {
        id: categoryId
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

  async askAI(userId, question) {
    console.log('Valor de question dentro de repository askAI:', question);

    // Construir el contexto para preguntas relacionadas con los datos del usuario
    const userData = await this.fetchData(userId);
    const generalContext = `
      Información del usuario:
      - Nombre: ${userData.nombreUsuario}
      - Balance: ${userData.resumenFinanzas.balance}
      - Metas: ${userData.metas.map(meta => `${meta.nombre} (${meta.monto_actual}/${meta.monto_objetivo})`).join(', ') || 'No tienes metas creadas'}
      - Recordatorios pendientes: ${userData.recordatorios.filter(r => r.estado === 'pendiente').length || 0}
      - Recordatorios: ${userData.recordatorios.map(r => `${r.nombre} (Inicio: ${r.fecha_inicio}, Vencimiento: ${r.fecha_vencimiento})`).join(', ') || 'No tienes recordatorios'}
      - Transacciones recientes: ${userData.transacciones.slice(0, 5).map(t => `${t.descripcion} (${t.tipo}: ${t.monto})`).join(', ') || 'No tienes transacciones recientes'}
    `;

    const context = generalContext; // Usar siempre el contexto general
    const API_KEY = process.env.GEMINI_API_KEY;
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    try {
      const body = {
        contents: [
          {
            parts: [
              { text: `Contexto:\n${context}\n\nPregunta: ${question}` }
            ]
          }
        ]
      };

      const response = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        console.error(`Error HTTP al comunicarse con la API de Gemini: ${response.status}`);
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (!data.candidates || data.candidates.length === 0) {
        console.error('Respuesta vacía o inválida de la API de Gemini:', data);
        throw new Error('La API de IA no devolvió una respuesta válida.');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error al comunicarse con la API de Gemini:', error);
      throw new Error('Error al obtener respuesta de la IA.');
    }
  }

  async saveChat(userId, question, answer, isSensitive = false) {
    return await ChatBot.create({
      usuario_id: userId,
      pregunta: question,
      respuesta: answer,
      sensible: isSensitive, // Nuevo campo para marcar conversaciones sensibles
    });
  }

  async limitSensitiveChatHistory(userId, limit) {
    const sensitiveChats = await ChatBot.findAll({
      where: { usuario_id: userId, sensible: true },
      order: [['id', 'DESC']],
      offset: limit, // Saltar las últimas `limit` conversaciones
    });

    // Eliminar conversaciones sensibles que excedan el límite
    const idsToDelete = sensitiveChats.map(chat => chat.id);
    if (idsToDelete.length > 0) {
      await ChatBot.destroy({ where: { id: idsToDelete } });
    }
  }
  
  // Obtener el historial de conversaciones del usuario con la IA
  async getChatHistory(userId) {
    const chatHistory = await ChatBot.findAll({
      where: { usuario_id: userId },
      order: [['id', 'ASC']], // Ordenar por ID para mostrar en orden cronológico
    });
    return chatHistory;
  }

  //-------------------------------Notificaciones--------------------------------

  async getNotificaciones(userId) {
    return await Notificaciones.findAll({
      where: { usuario_id: userId },
      order: [['fecha', 'DESC']],
    });
  }

  async marcarNotificacionesLeidas(userId) {
    await Notificaciones.update(
      { leida: true },
      { where: { usuario_id: userId, leida: false } }
    );
  }

  async crearNotificacion(userId, mensaje) {
    return await Notificaciones.create({
      usuario_id: userId,
      mensaje,
    });
  }
}

export default DashboardRepository;
