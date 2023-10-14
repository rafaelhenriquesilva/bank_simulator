import BankAccount from "../entities/BankAccount";
import Transaction from "../entities/Transaction";
import { GlobalRepository } from "../repositories/global.repository";
import { Request, Response } from 'express';
import { LoggerUtil } from "../utils/logger.util";
import TransactionHelper from "../helpers/transaction.helper";
import { ResponseUtil } from "../utils/response.util";
import BankAccountHelper from "../helpers/bank_account.helper";
import TransactionQuery from "../queries/transaction.query";
import { QueryTypes } from "sequelize";


export class TransactionService {

    constructor() {
        LoggerUtil.logInfo('Starting TransactionService', 'service/transaction.service.ts');
    }

    async getAll(request: Request, response: Response) {
        try {
            LoggerUtil.logInfo('Starting getAll', 'service/transaction.service.ts');
            let globalRepository = new GlobalRepository(null);
            let transactions = await globalRepository.executeQuery(await TransactionQuery.getTransactions(), QueryTypes.SELECT);
            response.status(200).json({
                transactions: transactions
            });
        } catch (error) {
            LoggerUtil.logError(`Error in getAll: ${error}`, 'service/transaction.service.ts', 'getAll');
            response.status(500).json(error);
        }
    }

    async getTransactionsByType(request: Request, response: Response) {
        try {
            const { type } = request.params;
            let complementQuery = ' where `transaction`.`type` =' + `'`+ type +`'` + ' ';
            LoggerUtil.logInfo(`Starting getTransactionsByType: type=${type}`, 'service/transaction.service.ts');
            let globalRepository = new GlobalRepository(null);
            let transactions = await globalRepository.executeQuery(await TransactionQuery.getTransactions(complementQuery), QueryTypes.SELECT);
            response.status(200).json({
                transactions: transactions
            });
        } catch (error) {
            LoggerUtil.logError(`Error in getTransactionsByType: ${error}`, 'service/transaction.service.ts', 'getTransactionsByType');
            response.status(500).json(error);
        }
    }

    async withdraw(request: Request, response: Response) {
        try {
            const { number_account_origin, value } = request.body;
            let bankAccount: BankAccount[] = [];
            let errors = new Array<string>();
           
            bankAccount = await BankAccountHelper.searchBankAccountByNumberAccount(number_account_origin, errors);
            
            if(bankAccount && bankAccount.length > 0) await TransactionHelper.verifyBalance(bankAccount[0], value, errors);
            
            let callback = async () => {
               if (bankAccount && bankAccount.length > 0) {
                    let newBalance = await BankAccountHelper.updateBalance(bankAccount[0], value, number_account_origin, 'withdraw');
                    let transactionData = await TransactionHelper.createDataTransaction(number_account_origin, 'saque', value);
                    let newTransaction = await TransactionHelper.insertTransaction(transactionData);
                    LoggerUtil.logInfo(`Withdraw completed: number_account_origin=${number_account_origin} / value=${value}`, 'service/transaction.service.ts');
                    response.status(201).json({
                        message: 'Saque realizado com sucesso',
                        transaction: newTransaction,
                        newBalance: newBalance
                    });
                } else {
                    response.status(404).json({
                        message: 'Bank account not found'
                    });
                }
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
           
            bankAccount = await BankAccountHelper.searchBankAccountByNumberAccount(number_account_origin, errors);
            let newBalance = 0;
            if(bankAccount && bankAccount.length > 0){
                newBalance = await BankAccountHelper.updateBalance(bankAccount[0], value, number_account_origin, 'deposit');
            }
           
            
            let callback = async () => {
                if(bankAccount && bankAccount.length > 0){
                    let transactionData = await TransactionHelper.createDataTransaction(number_account_origin, 'deposito', value);
                    let newTransaction = await TransactionHelper.insertTransaction(transactionData);
                    LoggerUtil.logInfo(`Deposit completed: number_account_origin=${number_account_origin} / value=${value}`, 'service/transaction.service.ts');
                    response.status(201).json({
                        message: 'Depósito realizado com sucesso',
                        transaction: newTransaction,
                        newBalance: newBalance
                    });
                }else{
                    response.status(404).json({
                        message: 'Bank account not found'
                    });
                }
            }

            ResponseUtil.showErrorsOrExecuteFunction(errors, response, callback);

        } catch (error) {
            LoggerUtil.logError(`Error in deposit: ${error}`, 'service/transaction.service.ts', 'deposit');
            response.status(500).json(error);
        }
    }

    async transfer(request: Request, response: Response) {
        try {
            let { number_account_origin, number_account_destination, value } = request.body;
            let errors = new Array<string>();
            LoggerUtil.logInfo(`Starting transfer: number_account_origin=${number_account_origin} / number_account_destination=${number_account_destination} / value=${value}`, 'service/transaction.service.ts');
            let arrayNumbersAccount = [number_account_origin, number_account_destination];
            let bankAccounts = await BankAccountHelper.searchBankAccounts(arrayNumbersAccount, errors);
            await TransactionHelper.verifyBalance(bankAccounts[0], value, errors);
            let callback = async () => {
                let newBalanceOrigin = await BankAccountHelper.updateBalance(bankAccounts[0], value, number_account_origin, 'withdraw');
                let newBalanceDestination = await BankAccountHelper.updateBalance(bankAccounts[1], value, number_account_destination, 'deposit');

                let transactionData = await TransactionHelper.createDataTransaction(number_account_origin, 'transferencia', value, number_account_destination);
                let newTransaction = await TransactionHelper.insertTransaction(transactionData);
                LoggerUtil.logInfo(`Transfer completed: number_account_origin=${number_account_origin} / number_account_destination=${number_account_destination} / value=${value}`, 'service/transaction.service.ts');
                response.status(201).json({
                    message: 'Transferência realizada com sucesso',
                    transaction: newTransaction,
                    newBalanceOrigin: newBalanceOrigin,
                    newBalanceDestination: newBalanceDestination
                });
            }
            ResponseUtil.showErrorsOrExecuteFunction(errors, response, callback);
        } catch (error) {
            LoggerUtil.logError(`Error in transfer: ${error}`, 'service/transaction.service.ts', 'transfer');
            response.status(500).json(error);
        }
    }

}