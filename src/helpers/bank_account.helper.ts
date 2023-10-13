import { BankAccountDto } from "../dtos/bank_account.dto";
import BankAccount from "../entities/BankAccount";
import { GlobalRepository } from "../repositories/global.repository";
import { LoggerUtil } from "../utils/logger.util";
export default class BankAccountHelper {
    static async searchBankAccountByNumberAccount(number_account: string, errors: Array<string>) {
        
        let globalRepository = new GlobalRepository(BankAccount);
        let bankAccount = await globalRepository.getDataByParameters({ number_account: number_account }) as BankAccount[];

        if (!bankAccount) {
            LoggerUtil.logError(`Account not found: number_account_origin=${number_account}`, 'service/transaction.service.ts', 'withdraw');
            errors.push('Account not found');
        }
        return bankAccount;

    }

    
    static async veryfyBankAccountExists(number_account: string, errors: Array<string>) {
        let globalRepository = new GlobalRepository(BankAccount);
        let bankAccountWithNumberAccountRecipe = await globalRepository.getDataByParameters({ number_account: number_account });

        if (bankAccountWithNumberAccountRecipe.length > 0) {
            LoggerUtil.logError(`Bank account already exists: ${JSON.stringify(bankAccountWithNumberAccountRecipe)}` , 'service/bank_account.service.ts', 'createBankAccount');
            errors.push('Bank account already exists');
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

    static async createDataBankAccount(number_account: string, type: string, value: number, action: string) {
        let data = {} as BankAccountDto;

        if (type) {
            data.type = type as any;
        }

        if (value) {
            data.balance = value;
        }

        if (number_account) {
            data.number_account = number_account;
        }

        if (action == 'create') {
            data.created_at = new Date();
            data.updated_at = new Date();
        }else if (action == 'update') {
            data.updated_at = new Date();
        }

        return data;
    }

    static verifyNumberAccountChanged(body: any, errors: Array<string>) {
        if(body.number_account){
            errors.push('Number account cannot be changed');
        }
    }
    
}