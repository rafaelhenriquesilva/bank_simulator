import {
    BankAccountAttributes
 } from '../interfaces/IBankAccount'
export class BankAccountDto implements BankAccountAttributes {
    id: number;
    number_account: string;
    type: 'corrente' | 'poupanca';
    balance: number;
    created_at: Date;
    updated_at: Date;
    constructor(bankAccount: BankAccountAttributes) {
        this.id = bankAccount.id;
        this.number_account = bankAccount.number_account;
        this.type = bankAccount.type;
        this.balance = bankAccount.balance;
        this.created_at = bankAccount.created_at;
        this.updated_at = bankAccount.updated_at;
    }
}