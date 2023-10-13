import BankAccount from "../entities/BankAccount";
import Transaction from "../entities/Transaction";
import { GlobalRepository } from "../repositories/global.repository";
import { Request, Response } from 'express';
import { LoggerUtil } from "../utils/logger.util";
import TransactionHelper from "../helpers/transaction.helper";
import { ResponseUtil } from "../utils/response.util";

export class TransactionService {

    constructor() {
        LoggerUtil.logInfo('Starting TransactionService', 'service/transaction.service.ts');
    }

    async getAll(request: Request, response: Response) {
        try {
            LoggerUtil.logInfo('Starting getAll', 'service/transaction.service.ts');
            let globalRepository = new GlobalRepository(Transaction);
            let transactions = await globalRepository.getDataByParameters({})
            response.status(200).json({
                transactions: transactions
            });
        } catch (error) {
            LoggerUtil.logError(`Error in getAll: ${error}`, 'service/transaction.service.ts', 'getAll');
            response.status(500).json(error);
        }
    }

    async withdraw(request: Request, response: Response) {
        try {
            const { number_account_origin, value } = request.body;
            let bankAccount: BankAccount[] = [];
            let errors = new Array<string>();
           
            bankAccount = await TransactionHelper.searchBankAccountByNumberAccount(number_account_origin, errors);
            await TransactionHelper.verifyBalance(bankAccount, value, errors);
            
            let callback = async () => {
                let newBalance = await TransactionHelper.updateBalance(bankAccount, value, number_account_origin, 'withdraw');
                let transactionData = await TransactionHelper.createDataTransaction(number_account_origin, 'saque', value);
                let newTransaction = await TransactionHelper.insertTransaction(transactionData);
                LoggerUtil.logInfo(`Withdraw completed: number_account_origin=${number_account_origin} / value=${value}`, 'service/transaction.service.ts');
                response.status(201).json({
                    message: 'Saque realizado com sucesso',
                    transaction: newTransaction,
                    newBalance: newBalance
                });
            };
            
            ResponseUtil.showErrorsOrExecuteFunction(errors, response, callback);
           
        } catch (error) {
            LoggerUtil.logError(`Error in withdraw: ${error}`, 'service/transaction.service.ts', 'withdraw');
            response.status(500).json(error);
        }
    }


    async deposit(request: Request, response: Response) {
        try {
            const { number_account_origin, value } = request.body;
            LoggerUtil.logInfo(`Starting deposit: number_account_origin=${number_account_origin} / value=${value}`, 'service/transaction.service.ts');
            let bankAccount: BankAccount[] = [];
            let errors = new Array<string>();
           
            bankAccount = await TransactionHelper.searchBankAccountByNumberAccount(number_account_origin, errors);
           
            let newBalance = await TransactionHelper.updateBalance(bankAccount, value, number_account_origin, 'deposit');
            
            let callback = async () => {
                let transactionData = await TransactionHelper.createDataTransaction(number_account_origin, 'deposito', value);
    
                let globalRepositoryTransaction = new GlobalRepository(Transaction);
                let newTransaction = await globalRepositoryTransaction.createData(transactionData) as Transaction;
                LoggerUtil.logInfo(`Deposit completed: number_account_origin=${number_account_origin} / value=${value}`, 'service/transaction.service.ts');
                response.status(201).json({
                    message: 'Depósito realizado com sucesso',
                    transaction: newTransaction,
                    newBalance: newBalance
                });
            }

            ResponseUtil.showErrorsOrExecuteFunction(errors, response, callback);

        } catch (error) {
            LoggerUtil.logError(`Error in deposit: ${error}`, 'service/transaction.service.ts', 'deposit');
            response.status(500).json(error);
        }
    }


}