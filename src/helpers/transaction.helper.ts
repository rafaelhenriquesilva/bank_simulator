import { Transaction } from "sequelize";
import BankAccount from "../entities/BankAccount";
import { GlobalRepository } from "../repositories/global.repository";
import { LoggerUtil } from "../utils/logger.util";


export default class TransactionHelper {

    static verifyBalance(bankAccount: BankAccount[], value: number, errors: Array<string>) {
        if (bankAccount && bankAccount[0].balance < value) {
            LoggerUtil.logError(`Insufficient balance: number_account_origin=${bankAccount[0].number_account} / value=${value}`, 'service/transaction.service.ts', 'withdraw');
            errors.push('Insufficient balance');
        }
    }
    
    static async createDataTransaction(number_account: string, type: string, value: number) {
        let data = {
            number_account_origin: number_account,
            type: type,
            value: value,
            created_at: new Date(),
            updated_at: new Date()
        }
        LoggerUtil.logInfo(`Starting createDataTransaction: data=${data}`, 'helper/transaction.helper.ts');
        return data;
    }

    static async insertTransaction(data: any) {
        try {
            LoggerUtil.logInfo(`Starting createDataTransaction: data=${data}`, 'helper/transaction.helper.ts');
            let globalRepositoryTransaction = new GlobalRepository(Transaction);
            let newTransaction = await globalRepositoryTransaction.createData(data);
            return newTransaction;
        } catch (error) {
            LoggerUtil.logError(`Error in createDataTransaction: ${error}`, 'service/transaction.service.ts', 'createDataTransaction');
            throw error;
        }
    }
}