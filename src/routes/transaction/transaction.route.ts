import { Request, Response, Router } from 'express';
import { LoggerUtil } from '../../utils/logger.util';
import { TransactionService } from '../../service/transaction.service';
import { TransactionValidator } from '../../validators/transaction.validator';

const transactionRoute = Router();

export class TransactionRoute {
    init(){
        LoggerUtil.logInfo('Starting TransactionRoute', 'routes/transaction/transaction.route.ts');
        transactionRoute.post('/withdraw', TransactionValidator.createTransactionValidator(), this.withdraw);
        transactionRoute.post('/deposit', TransactionValidator.createTransactionValidator(), this.deposit);
        transactionRoute.get('/all', this.getAll);
        transactionRoute.post('/transfer', TransactionValidator.createTransferValidator(), this.transfer);
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

    public async transfer(req: Request, res: Response) {
        LoggerUtil.logInfo('Starting transfer', 'routes/transaction/transaction.route.ts');
        const transactionService = new TransactionService();
        await transactionService.transfer(req, res);
    }

    getRoute() {
        return transactionRoute;
    }
}

