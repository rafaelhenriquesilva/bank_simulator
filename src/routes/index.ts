import express from 'express';
import { HealthRoute } from './health/health.route';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import { LoginRoute } from './login/login.route';
import { RouterConfigDto } from '../dtos/router_config.dto';
import { UserRoute } from './user/user.route';
import { LoggerUtil } from '../utils/logger.util';
import { BankAccountRoute } from './bank_account/bank_account.route';


import { GlobalRepository } from '../repositories/global.repository';
import Transaction from '../entities/Transaction';


LoggerUtil.logInfo('Iniciando as rotas', 'routes/index.ts');

export const routes = express.Router();
  
// Rota do Swagger 
routes.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Rota para exportar o json do swagger
routes.get('/json-to-export', (req, res) => {
    res.json(swaggerDocument);
});

routes.get('/transaction', async  (req, res) => {
    let globalRepository = new GlobalRepository(Transaction);

    let newTransaction = {
        number_account_destiny: "48348233",
        number_account_origin: "123456789",
        type: 'transferencia',
        value: 100,
        created_at: new Date(),
        updated_at: new Date()
    }

    await globalRepository.createData(newTransaction);


    let transactions = await globalRepository.getDataByParameters({});
    res.json(transactions);
});

/**
 * Instanciando as rotas
 */
new RouterConfigDto(new HealthRoute(), 'init', '/health', routes);
new RouterConfigDto(new LoginRoute(), 'init', '/login', routes);
new RouterConfigDto(new UserRoute(), 'init', '/user', routes);
new RouterConfigDto(new BankAccountRoute(), 'init', '/bank-account', routes);

