const dotenv = require('dotenv');
dotenv.config({
    path: process.env.NODE_ENV === 'production' ? '.env': '.env.test'
});
module.exports = {
    dialect: process.env.DB_DIALECT || 'sqlite',
    host: process.env.DB_HOST || 'localhost', 
    username: process.env.DB_USERNAME || 'root', 
    password: process.env.DB_PASSWORD || '', 
    database: process.env.DB_DATABASE || 'database',
    storage: './__base__/database.sqlite',
    operatorAliases : false,
    logging: true,
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
}