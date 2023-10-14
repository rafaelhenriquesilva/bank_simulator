import { Request, Response } from "express";
import { GlobalRepository } from "../repositories/global.repository";
import BankAccount from "../entities/BankAccount";
import { LoggerUtil } from "../utils/logger.util";
import { ResponseUtil } from "../utils/response.util";
import BankAccountHelper from "../helpers/bank_account.helper";
import Transaction from "../entities/Transaction";

export class BankAccountService {
    globalRepository = new GlobalRepository(BankAccount);
    constructor() { 
        LoggerUtil.logInfo('Starting BankAccountService', 'service/bank_account.service.ts');
    }

    async createBankAccount(request: Request, response: Response) {
        try {
            const body = request.body;
            LoggerUtil.logInfo(`Starting createBankAccount: ${JSON.stringify(body)}`, 'service/bank_account.service.ts');
            let errors: Array<string> = [];

            await BankAccountHelper.verifyBankAccountExists(body.number_account, errors);
            let callback = async () => {
                let data = await BankAccountHelper.createDataBankAccount(body.number_account, body.type, body.balance, 'create');
    
                let newBankAccount = await this.globalRepository.createData(data as BankAccount) ;
                LoggerUtil.logInfo(`Finishing createBankAccount: ${JSON.stringify(newBankAccount)}`, 'service/bank_account.service.ts');
                response.status(200).json(newBankAccount);
            };

            ResponseUtil.showErrorsOrExecuteFunction(errors, response, callback);
        } catch (error: any) {
            LoggerUtil.logError(`Error: ${error.message}`, 'service/bank_account.service.ts', 'createBankAccount');
            response.status(500).json({ error: error.message });
        }
    }

    async getBankAccountByNumber(request: Request, response: Response) {
        const { number_account } = request.params;
        let errors: Array<string> = [];
        LoggerUtil.logInfo(`Starting getBankAccountByNumber: ${number_account}`, 'service/bank_account.service.ts');
        let bankAccount = await BankAccountHelper.searchBankAccountByNumberAccount(number_account, errors);

        let callback = async () => {
                LoggerUtil.logInfo(`Finishing getBankAccountByNumber: ${JSON.stringify(bankAccount)}`, 'service/bank_account.service.ts');
                response.status(200).json(bankAccount);
        };

        ResponseUtil.showErrorsOrExecuteFunction(errors, response, callback);
    }

    getAllBankAccounts(request: Request, response: Response) {
        LoggerUtil.logInfo(`Starting getAllBankAccounts`, 'service/bank_account.service.ts');

        let callback = async () => {
            let bankAccounts = await this.globalRepository.getDataByParameters({} as BankAccount);
            LoggerUtil.logInfo(`Finishing getAllBankAccounts: ${JSON.stringify(bankAccounts)}`, 'service/bank_account.service.ts');
            response.status(200).json(bankAccounts);
        };

        ResponseUtil.showErrorsOrExecuteFunction([], response, callback);
    }

    async updateBankAccount(request: Request, response: Response) {
        try {
            const body = request.body;
            const { number_account } = request.params;
            
            LoggerUtil.logInfo(`Starting updateBankAccount: ${JSON.stringify(body)}`, 'service/bank_account.service.ts');
            let errors: Array<string> = [];
            await BankAccountHelper.searchBankAccountByNumberAccount(number_account, errors);

            BankAccountHelper.verifyBankAccountExists(number_account, errors);

            let callback = async () => {
                let data = await BankAccountHelper.createDataBankAccount('', body.type, body.balance, 'update'); 
                
                let updateBankAccount = await this.globalRepository.updateData(data, { number_account: number_account } as BankAccount);
                LoggerUtil.logInfo(`Finishing updateBankAccount: ${JSON.stringify(updateBankAccount)}`, 'service/bank_account.service.ts');
                response.status(200).json(updateBankAccount);
            };

            ResponseUtil.showErrorsOrExecuteFunction(errors, response, callback);
        } catch (error: any) {
            LoggerUtil.logError(`Error: ${error.message}`, 'service/bank_account.service.ts', 'updateBankAccount');
            response.status(500).json({ error: error.message });
        }
    }

    async deleteBankAccount(request: Request, response: Response) {
        const { number_account } = request.params;
        let errors: Array<string> = [];

        let bank_account = await BankAccountHelper.searchBankAccountByNumberAccount(number_account, errors);
        LoggerUtil.logInfo(`Starting deleteBankAccount: ${number_account}`, 'service/bank_account.service.ts');

        let callback = async () => {
                let globalRepositoryTransaction = new GlobalRepository(Transaction); 
                let whereNumberAccountOrigin = {  number_account_origin : number_account } as any;
                let whereNumberAccountDestiny = {  number_account_destiny : number_account } as any;
                await globalRepositoryTransaction.deleteAllData(whereNumberAccountOrigin);
                await globalRepositoryTransaction.deleteAllData(whereNumberAccountDestiny);   

                await this.globalRepository.deleteData(bank_account[0].id);
                LoggerUtil.logInfo(`Finishing deleteBankAccount: ${number_account}`, 'service/bank_account.service.ts');
                response.status(200).json({ message: 'Bank account deleted' });
          
        };

        ResponseUtil.showErrorsOrExecuteFunction(errors, response, callback);
    }
}