import { Transaction } from "sequelize";
import BankAccount from "../entities/BankAccount";
import { GlobalRepository } from "../repositories/global.repository";
import { LoggerUtil } from "../utils/logger.util";


export default class TransactionHelper {
    static async searchBankAccountByNumberAccount(number_account: string, errors: Array<string>) {
        let globalRepository = new GlobalRepository(BankAccount);

        let bankAccount = await globalRepository.getDataByParameters({ number_account: number_account }) as BankAccount[];

        if (!bankAccount) {
            LoggerUtil.logError(`Account not found: number_account_origin=${number_account}`, 'service/transaction.service.ts', 'withdraw');
            errors.push('Account not found');
        }
        return bankAccount;
    }

    static verifyBalance(bankAccount: BankAccount[], value: number, errors: Array<string>) {
        if (bankAccount && bankAccount[0].balance < value) {
            LoggerUtil.logError(`Insufficient balance: number_account_origin=${bankAccount[0].number_account} / value=${value}`, 'service/transaction.service.ts', 'withdraw');
            errors.push('Insufficient balance');
        }
    }

    static async updateBalance(bankAccount: BankAccount[], value: number, numberAccount: string, operationType: string) {
        try {
            LoggerUtil.logInfo(`Starting updateBalance: numberAccount=${numberAccount} / value=${value}`, 'helper/transaction.helper.ts');

            let globalRepository = new GlobalRepository(BankAccount);
            let balanceToFloat = parseFloat(bankAccount[0].balance as any);
            let valueToFloat = parseFloat(value as any);

            let newBalance = 0;
            if (operationType == 'deposit') {
                newBalance = balanceToFloat + valueToFloat;
            } else if (operationType == 'withdraw') {
                newBalance = balanceToFloat - valueToFloat;
            }


            let dataToUpdate = {
                balance: newBalance,
                updated_at: new Date()
            }

            await globalRepository.updateData(dataToUpdate, { number_account: numberAccount });
            return newBalance;
        } catch (error) {
            LoggerUtil.logError(`Error in updateBalance: ${error}`, 'service/transaction.service.ts', 'updateBalance');
            throw error;

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