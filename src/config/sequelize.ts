import { Sequelize, Options } from 'sequelize';
import * as dotenv from 'dotenv';
import { LoggerUtil } from '../utils/logger.util';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env': '.env.test'
});
// Defina uma interface para as configurações do banco de dados
interface DatabaseConfig extends Options {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: 'mysql' | 'sqlite' | 'postgres' | 'mssql'; 
}

let databaseConfig: DatabaseConfig = new Object() as DatabaseConfig;

LoggerUtil.logInfo(`Iniciando o banco de dados no ambiente: ${process.env.NODE_ENV}`, 'config/sequelize.ts');

let dialect = process.env.DB_DIALECT as 'mysql' | 'sqlite' | 'postgres' | 'mssql' || 'sqlite';

if(process.env.NODE_ENV === 'production') {
  databaseConfig = {
    username: process.env.DB_USERNAME || 'seu_username',
    password: process.env.DB_PASSWORD || 'sua_senha',
    database: process.env.DB_DATABASE || 'sua_base_de_dados',
    host: process.env.DB_HOST || 'localhost',
    dialect: dialect, 
    define: {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    logging: false
  };
}else {
  databaseConfig = {
    username: process.env.DB_USERNAME || 'seu_username',
    password: process.env.DB_PASSWORD || 'sua_senha',
    database: process.env.DB_DATABASE || 'sua_base_de_dados',
    host: process.env.DB_HOST || 'localhost',
    dialect: dialect, 
    storage: './__base__/database.sqlite',
    define: {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    logging: false
  };
}
const sequelize = new Sequelize(databaseConfig as DatabaseConfig);

// Teste a conexão
async function testConnection() {
  try {
    
    await sequelize.authenticate();
    LoggerUtil.logInfo('Conexão com o banco de dados estabelecida com sucesso.', 'config/sequelize.ts');
  } catch (error) {
    LoggerUtil.logError('Não foi possível conectar ao banco de dados.', 'config/sequelize.ts', 'testConnection');
  }
}

// Chame a função de teste de conexão
testConnection();

export default {
  original: sequelize
};
