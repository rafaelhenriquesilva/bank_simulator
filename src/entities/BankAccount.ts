import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'; // Importe a instância do Sequelize

class BankAccount extends Model {
  public id!: number;
  public number_account!: string;
  public type!: 'corrente' | 'poupanca';
  public balance!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

BankAccount.init(
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    number_account: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isIn: [['corrente', 'poupanca']],
        },
    },
    balance:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: new Date()
    }
  },
  {
    sequelize: sequelize.original,
    modelName: 'BankAccount',
    tableName: 'bank_account',
  }
);

export default BankAccount;
