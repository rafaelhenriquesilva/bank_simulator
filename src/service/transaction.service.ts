import BankAccount from "../entities/BankAccount";
import Transaction from "../entities/Transaction";
import { GlobalRepository } from "../repositories/global.repository";
import { Request, Response } from 'express';
import { LoggerUtil } from "../utils/logger.util";
export class TransactionService {

    async withdraw(request: Request, response: Response) {
        try {
            const { number_account_origin, value } = request.body;
            let globalRepository = new GlobalRepository(BankAccount);

            let bankAccount = await globalRepository.getDataByParameters({ number_account: number_account_origin }) as BankAccount[];

            if (!bankAccount) {
                response.status(400).json({ message: 'Conta não encontrada' });
                return;
            }

            if (bankAccount && bankAccount[0].balance < value) {
                response.status(400).json({ message: 'Saldo insuficiente' });
                return;
            }

            let balanceToFloat = parseFloat(bankAccount[0].balance as any);
            let valueToFloat = parseFloat(value as any);

            let newBalance = balanceToFloat - valueToFloat;

            let dataToUpdate = {
                balance: newBalance,
                updated_at: new Date()
            }

            await globalRepository.updateData(dataToUpdate, { number_account: number_account_origin });

            let data = {
                number_account_origin: number_account_origin,
                type: 'saque',
                value: value,
                created_at: new Date(),
                updated_at: new Date()
            }

            let globalRepositoryTransaction = new GlobalRepository(Transaction);
            let newTransaction = await globalRepositoryTransaction.createData(data) as Transaction;
            response.status(201).json({
                message: 'Saque realizado com sucesso',
                transaction: newTransaction,
                newBalance: newBalance
            });
        } catch (error) {
            response.status(500).json(error);
        }
    }


    async deposit(request: Request, response: Response) {
        try {
            const { number_account_origin, value } = request.body;
            let globalRepository = new GlobalRepository(BankAccount);

            let bankAccount = await globalRepository.getDataByParameters({ number_account: number_account_origin }) as BankAccount[];

            if (!bankAccount) {
                response.status(400).json({ message: 'Conta não encontrada' });
                return;
            }
            let balanceToFloat = parseFloat(bankAccount[0].balance as any);
            let valueToFloat = parseFloat(value as any);

            let newBalance = balanceToFloat + valueToFloat;


            let dataToUpdate = {
                balance: newBalance,
                updated_at: new Date()
            }

            await globalRepository.updateData(dataToUpdate, { number_account: number_account_origin });

            let data = {
                number_account_origin: number_account_origin,
                type: 'deposito',
                value: value,
                created_at: new Date(),
                updated_at: new Date()
            }

            let globalRepositoryTransaction = new GlobalRepository(Transaction);
            let newTransaction = await globalRepositoryTransaction.createData(data) as Transaction;
            response.status(201).json({
                message: 'Depósito realizado com sucesso',
                transaction: newTransaction,
                newBalance: newBalance
            });
        } catch (error) {
            response.status(500).json(error);
        }
    }


}