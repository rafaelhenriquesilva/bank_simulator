import { Optional } from 'sequelize';
export interface BankAccountAttributes {
    id: number;
    number_account: string;
    type: 'corrente' | 'poupanca';
    balance: number;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface BankAccountCreationAttributes extends Optional<BankAccountAttributes, 'id'> {}