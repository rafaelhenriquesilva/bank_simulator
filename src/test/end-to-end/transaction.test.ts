import supertest from 'supertest';
import { App } from '../../app';
import BankAccount from '../../entities/BankAccount';
import { GlobalRepository } from '../../repositories/global.repository';


const appInstance = new App();
const app = appInstance.exportApp();

const request = supertest(app);
let timeout = (process.env.TEST_TIMEOUT || 10000) as number;
let numberAccount = 222333444;
describe('Transactions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Create a bank account', async () => {
        const response = await request.post('/bank-account/create').send({
            number_account: numberAccount,
            type: 'corrente',
            balance: 1000
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('number_account');
        expect(response.body).toHaveProperty('type');
        expect(response.body).toHaveProperty('balance');

    }, timeout);

    it('Withdraw 500 of account', async () => {
        const withdraw = await request.post('/transaction/withdraw').send({
            number_account_origin: numberAccount,
            value: 500
        });

        const lstBankAccount = await request.get(`/bank-account/unique/${numberAccount}`);

        expect(lstBankAccount.status).toBe(200);
        expect(lstBankAccount.body[0]).toHaveProperty('number_account');
        expect(lstBankAccount.body[0]).toHaveProperty('balance');
        expect(parseFloat(lstBankAccount.body[0].balance)).toBe(500);

    }, timeout);

    it('Deposit 500 of account', async () => {
        const deposit = await request.post('/transaction/deposit').send({
            number_account_origin: numberAccount,
            value: 500
        });

        const lstBankAccount = await request.get(`/bank-account/unique/${numberAccount}`);

        expect(lstBankAccount.status).toBe(200);
        expect(lstBankAccount.body[0]).toHaveProperty('number_account');
        expect(lstBankAccount.body[0]).toHaveProperty('balance');
        expect(parseFloat(lstBankAccount.body[0].balance)).toBe(1000);

    });

    it('Delete a bank account', async () => {
        const response = await request.delete(`/bank-account/delete/${numberAccount}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Bank account deleted');
    }
    , timeout);
});




