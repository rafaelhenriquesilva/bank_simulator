import { Request, Response } from "express";
import { GlobalRepository } from "../repositories/global.repository";
import BankAccount from "../entities/BankAccount";
import { LoggerUtil } from "../utils/logger.util";
import { BankAccountDto } from "../dtos/bank_account.dto";
import { ResponseUtil } from "../utils/response.util";
import { error } from "winston";

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

            let bankAccountWithNumberAccountRecipe = await this.globalRepository.getDataByParameters({ number_account: body.number_account });

            if (bankAccountWithNumberAccountRecipe.length > 0) {
                LoggerUtil.logError(`Bank account already exists: ${JSON.stringify(bankAccountWithNumberAccountRecipe)}` , 'service/bank_account.service.ts', 'createBankAccount');
                errors.push('Bank account already exists');
            }

            let callback = async () => {
                let data = {
                    number_account: body.number_account,
                    type: body.type,
                    balance: body.balance,
                    created_at: new Date()
                } as BankAccountDto;
    
                let newBankAccount = await this.globalRepository.createData(data);
                LoggerUtil.logInfo(`Finishing createBankAccount: ${JSON.stringify(newBankAccount)}`, 'service/bank_account.service.ts');
                response.status(200).json(newBankAccount);
            };

            ResponseUtil.showErrorsOrExecuteFunction(errors, response, callback);
        } catch (error: any) {
            LoggerUtil.logError(`Error: ${error.message}`, 'service/bank_account.service.ts', 'createBankAccount');
            response.status(500).json({ error: error.message });
        }
    }

    getBankAccountByNumber(request: Request, response: Response) {
        const { number_account } = request.params;
        LoggerUtil.logInfo(`Starting getBankAccountByNumber: ${number_account}`, 'service/bank_account.service.ts');

        let callback = async () => {
            let bankAccount = await this.globalRepository.getDataByParameters({ number_account: number_account });

            if (bankAccount.length > 0) {
                LoggerUtil.logInfo(`Finishing getBankAccountByNumber: ${JSON.stringify(bankAccount)}`, 'service/bank_account.service.ts');
                response.status(200).json(bankAccount);
            } else {
                LoggerUtil.logError(`Bank account not found: ${number_account}` , 'service/bank_account.service.ts', 'getBankAccountByNumber');
                response.status(404).json({ error: 'Bank account not found' });
            }
        };

        ResponseUtil.showErrorsOrExecuteFunction([], response, callback);
    }

    getAllBankAccounts(request: Request, response: Response) {
        LoggerUtil.logInfo(`Starting getAllBankAccounts`, 'service/bank_account.service.ts');

        let callback = async () => {
            let bankAccounts = await this.globalRepository.getDataByParameters({});
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

            if(body.number_account){
                errors.push('Number account cannot be changed');
            }

            let callback = async () => {


                let data = {} as BankAccountDto;
                if (body.type) {
                    data.type = body.type;
                }
                if (body.balance) {
                    data.balance = body.balance;
                }
                
                let updateBankAccount = await this.globalRepository.updateData(data, { number_account: number_account });
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

        LoggerUtil.logInfo(`Starting deleteBankAccount: ${number_account}`, 'service/bank_account.service.ts');

        let callback = async () => {
            let bankAccount = await this.globalRepository.getDataByParameters({ number_account: number_account }) as BankAccount[];

            if (bankAccount.length > 0) {
                await this.globalRepository.deleteData(bankAccount[0].id);
                LoggerUtil.logInfo(`Finishing deleteBankAccount: ${number_account}`, 'service/bank_account.service.ts');
                response.status(200).json({ message: 'Bank account deleted' });
            } else {
                LoggerUtil.logError(`Bank account not found: ${number_account}` , 'service/bank_account.service.ts', 'deleteBankAccount');
                response.status(404).json({ error: 'Bank account not found' });
            }
        };

        ResponseUtil.showErrorsOrExecuteFunction([], response, callback);
    }
}