'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('conta_bancaria', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      numero_conta: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      tipo: {
        type: Sequelize.ENUM('corrente', 'poupanca'),
        allowNull: false,
      },
      saldo: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('conta_bancaria');
  },
};
