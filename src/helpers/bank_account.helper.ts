import { BankAccountDto } from "../dtos/bank_account.dto";
import BankAccount from "../entities/BankAccount";
import { GlobalRepository } from "../repositories/global.repository";
import { LoggerUtil } from "../utils/logger.util";
export default class BankAccountHelper {
    static async searchBankAccountByNumberAccount(number_account: string, errors: Array<string>) {

        let parameters = {
            number_account: number_account
        } as BankAccount;
        
        let bankAccount = this.getBankAccountByParameters(parameters);

        if (!bankAccount) {
            LoggerUtil.logError(`Account not found: number_account_origin=${number_account}`, 'service/transaction.service.ts', 'withdraw');
            errors.push('Account not found');
        }
        return bankAccount;

    }

    static async getBankAccountByParameters(parameters: BankAccount){
        let globalRepository = new GlobalRepository(BankAccount);
        let data = await globalRepository.getDataByParameters(parameters) as BankAccount[];
        return data;
    }
    
    static async verifyBankAccountExists(number_account: string, errors: Array<string>) {
        let parameters = {
            number_account: number_account
        } as BankAccount;
        
        let bankAccountWithNumberAccountRecipe = await this.getBankAccountByParameters(parameters) as BankAccount[];

        if (bankAccountWithNumberAccountRecipe.length > 0) {
            LoggerUtil.logError(`Bank account already exists: ${JSON.stringify(bankAccountWithNumberAccountRecipe)}` , 'service/bank_account.service.ts', 'createBankAccount');
            errors.push('Bank account already exists');
        }
    }

    static async updateBalance(bankAccount: BankAccount, value: number, numberAccount: string, operationType: string) {
        try {
            LoggerUtil.logInfo(`Starting updateBalance: numberAccount=${numberAccount} / value=${value}`, 'helper/transaction.helper.ts');

            let globalRepository = new GlobalRepository(BankAccount);
            let balanceToFloat = parseFloat(bankAccount.balance as any);
            let valueToFloat = parseFloat(value as any);

            let newBalance = balanceToFloat;
            if (operationType == 'deposit') {
                newBalance += valueToFloat;
            } else if (operationType == 'withdraw') {
                newBalance -= valueToFloat;
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

    static verifyNumberAccountChanged(body: BankAccount, errors: Array<string>) {
        if(body.number_account){
            errors.push('Number account cannot be changed');
        }
    }

    static async searchBankAccounts(arrayNumbersAccount : Array<String>, errors: Array<string>): Promise<BankAccount[]> {
        let parameters = {
            number_account: arrayNumbersAccount
        } as any;
        
        let bankAccounts = await this.getBankAccountByParameters(parameters) as BankAccount[];

        if (bankAccounts.length != 2) {
            LoggerUtil.logError(`Account not found: arrayNumbersAccount: ${JSON.stringify(arrayNumbersAccount)}`, 'service/transaction.service.ts', 'transfer');
            errors.push(`Any account not found, please verify the numbers accounts`);
        }
        return bankAccounts;
    }
    
}