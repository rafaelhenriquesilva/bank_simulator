import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'; // Importe a instância do Sequelize

class TestAccount extends Model {
  public id!: number;
  public name!: string;
  public age!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

TestAccount.init(
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    age: {
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
    }
  },
  {
    sequelize: sequelize.original,
    modelName: 'TestAccount',
    tableName: 'test_account',
  }
);

export default TestAccount;