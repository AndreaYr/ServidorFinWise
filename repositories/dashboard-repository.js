import Transaction from '../dto/transacciones.js';

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
}

export default DashboardRepository;
