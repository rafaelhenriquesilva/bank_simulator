'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('bank_account', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      number_account: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      type: {
        type: Sequelize.ENUM('corrente', 'poupanca'),
        allowNull: false,
      },
      balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('bank_account');
  },
};
