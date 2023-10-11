import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'; // Importe a instância do Sequelize

class UserAuthentication extends Model {
  public id!: number;
  public username!: string;
  public token!: string;
  public password!: string;
  public created_at!: Date;
  public updated_at!: Date;
  public is_active!: boolean;
}

UserAuthentication.init(
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    is_active: {
        type: DataTypes.TINYINT
    }
  },
  {
    sequelize: sequelize.original,
    modelName: 'UserAuthentication',
    tableName: 'user_authentication',
  }
);

export default UserAuthentication;