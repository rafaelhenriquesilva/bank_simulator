import { Request, Response, Router } from 'express';
import { LoggerUtil } from '../../utils/logger.util';
import { TransactionService } from '../../service/transaction.service';
const transactionRoute = Router();

export class TransactionRoute {
    init(){
        LoggerUtil.logInfo('Starting TransactionRoute', 'routes/transaction/transaction.route.ts');
        transactionRoute.post('/withdraw', this.withdraw);
        transactionRoute.post('/deposit', this.deposit);
        transactionRoute.get('/all', this.getAll);
    }

    public async withdraw(req: Request, res: Response) {
        LoggerUtil.logInfo('Starting withdraw', 'routes/transaction/transaction.route.ts');
        const transactionService = new TransactionService();
        await transactionService.withdraw(req, res);
    }

    public async deposit(req: Request, res: Response) {
        LoggerUtil.logInfo('Starting deposit', 'routes/transaction/transaction.route.ts');
        const transactionService = new TransactionService();
        await transactionService.deposit(req, res);
    }

    public async getAll(req: Request, res: Response) {
        LoggerUtil.logInfo('Starting getAll', 'routes/transaction/transaction.route.ts');
        const transactionService = new TransactionService();
        await transactionService.getAll(req, res);
    }

    getRoute() {
        return transactionRoute;
    }
}

