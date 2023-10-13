
import BankAccount from "../entities/BankAccount";
import Transaction from "../entities/Transaction";
import { GlobalRepository } from "../repositories/global.repository";
import { LoggerUtil } from "../utils/logger.util";


export default class TransactionHelper {

    static verifyBalance(bankAccount: BankAccount, value: number, errors: Array<string>) {
        if (bankAccount && bankAccount.balance < value) {
            LoggerUtil.logError(`Insufficient balance: number_account_origin=${bankAccount.number_account} / value=${value}`, 'service/transaction.service.ts', 'withdraw');
            errors.push(`Insufficient balance: number_account=${bankAccount.number_account} / value=${value}`);
        }
    }

    static async createDataTransaction(number_account_origin: string, type: string, value: number, number_account_destination?: string) {
        let data = {
            number_account_origin: number_account_origin,
            type: type,
            value: value,
            created_at: new Date(),
            updated_at: new Date()
        } as any;

        if (number_account_destination) {
            data['number_account_destiny'] = number_account_destination;
        }
        LoggerUtil.logInfo(`Starting createDataTransaction: data=${data}`, 'helper/transaction.helper.ts');
        return data;
    }

    static async insertTransaction(data: Transaction) {
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