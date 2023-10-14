import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'; // Importe a instância do Sequelize
import BankAccount from './BankAccount';

class Transaction extends Model {
    public id!: number;
    public number_account_origin!: string;
    public number_account_destiny!: string;
    public value!: number;
    public type!: 'saque' | 'deposito' | 'transferencia';
    public created_at!: Date;
    public updated_at!: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    number_account_origin: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    number_account_destiny: {
      type: DataTypes.STRING(20),
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('saque', 'deposito', 'transferencia'),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize.original,
    modelName: 'Transaction', 
    tableName: 'transaction', 
  }
);

// Defina o relacionamento de chave estrangeira com a tabela 'bank_account'
Transaction.belongsTo(BankAccount, { foreignKey: 'number_account_origin', as: 'originAccount' });
Transaction.belongsTo(BankAccount, { foreignKey: 'number_account_destiny', as: 'destinyAccount' });

export default Transaction;
