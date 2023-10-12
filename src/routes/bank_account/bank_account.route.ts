import { Request, Response, Router } from 'express';
import { LoggerUtil } from '../../utils/logger.util';
import { BankAccountService } from '../../service/bank_account.service';
import { BankAccountValidator } from '../../validators/bank_account.validator';

const bankAccount = Router();

export class BankAccountRoute {
  public async init() {
    LoggerUtil.logInfo('Starting BankAccountRoute', 'routes/health/health.route.ts');
    bankAccount.post('/create', BankAccountValidator.createBankAccountValidator(), this.createBankAccount);
    bankAccount.get('/unique/:number_account', this.getBankAccopuntByNumber);
    bankAccount.get('/all', this.getAllBankAccounts);
    bankAccount.put('/update/:number_account', BankAccountValidator.updateUserValidator(), this.updateBankAccount);
  }

  public async createBankAccount(request: Request, response: Response) {
    LoggerUtil.logInfo('Starting createBankAccount', 'routes/health/health.route.ts');
    const bankAccountService = new BankAccountService();
    bankAccountService.createBankAccount(request, response);
  }

  public getBankAccopuntByNumber(request: Request, response: Response) {
    LoggerUtil.logInfo('Starting getBankAccopuntByNumber', 'routes/health/health.route.ts');
    const bankAccountService = new BankAccountService();
    bankAccountService.getBankAccountByNumber(request, response);
  }

  public getAllBankAccounts(request: Request, response: Response) {
    LoggerUtil.logInfo('Starting getAllBankAccounts', 'routes/health/health.route.ts');
    const bankAccountService = new BankAccountService();
    bankAccountService.getAllBankAccounts(request, response);
  }

  public updateBankAccount(request: Request, response: Response) {
    LoggerUtil.logInfo('Starting updateBankAccount', 'routes/health/health.route.ts');
    const bankAccountService = new BankAccountService();
    bankAccountService.updateBankAccount(request, response);
  }

  getRoute() {
    return bankAccount;
  }
}

