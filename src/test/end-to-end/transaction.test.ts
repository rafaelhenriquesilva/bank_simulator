import supertest from 'supertest';
import { App } from '../../app';
import { GlobalRepository } from '../../repositories/global.repository';
import { QueryTypes } from 'sequelize';
import Transaction from '../../entities/Transaction';

const appInstance = new App();
const app = appInstance.exportApp();

const request = supertest(app);
let timeout = (process.env.TEST_TIMEOUT || 10000) as number;
let numberAccountOrigin = 222333444;
let numberAccountDestination = 555666777;
describe('Transactions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Create a bank account origin', async () => {
        const response = await request.post('/bank-account/create').send({
            number_account: numberAccountOrigin,
            type: 'corrente',
            balance: 1000
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('number_account');
        expect(response.body).toHaveProperty('type');
        expect(response.body).toHaveProperty('balance');

    }, timeout);

    it('Create a bank account destination', async () => {
        const response = await request.post('/bank-account/create').send({
            number_account: numberAccountDestination,
            type: 'corrente',
            balance: 1000
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('number_account');
        expect(response.body).toHaveProperty('type');
        expect(response.body).toHaveProperty('balance');
    }, timeout)

    it('Delete all transactions', async () => {
        const globalRepository = new GlobalRepository(Transaction);
        await globalRepository.deleteAllData()
    })

    it('Withdraw 500 of account', async () => {
        const withdraw = await request.post('/transaction/withdraw').send({
            number_account_origin: numberAccountOrigin,
            value: 500
        });

        const lstBankAccount = await request.get(`/bank-account/unique/${numberAccountOrigin}`);

        expect(lstBankAccount.status).toBe(200);
        expect(lstBankAccount.body[0]).toHaveProperty('number_account');
        expect(lstBankAccount.body[0]).toHaveProperty('balance');
        expect(parseFloat(lstBankAccount.body[0].balance)).toBe(500);

    }, timeout);

    it('Inssuficient balance', async () => {
        let value = 600
        const withdraw = await request.post('/transaction/withdraw').send({
            number_account_origin: numberAccountOrigin,
            value: value
        });

        expect(withdraw.status).toBe(400);
        expect(withdraw.body).toHaveProperty('errors');
        expect(withdraw.body.errors[0]).toBe(`Insufficient balance: number_account=${numberAccountOrigin} / value=${value}`);

    }, timeout);

    it('Deposit 500 of account', async () => {
        const deposit = await request.post('/transaction/deposit').send({
            number_account_origin: numberAccountOrigin,
            value: 500
        });

        const lstBankAccount = await request.get(`/bank-account/unique/${numberAccountOrigin}`);

        expect(lstBankAccount.status).toBe(200);
        expect(lstBankAccount.body[0]).toHaveProperty('number_account');
        expect(lstBankAccount.body[0]).toHaveProperty('balance');
        expect(parseFloat(lstBankAccount.body[0].balance)).toBe(1000);

    }, timeout);

    it('Transfer 500 of account origin to account destination', async () => {
        const transfer = await request.post('/transaction/transfer').send({
            number_account_origin: numberAccountOrigin,
            number_account_destination: numberAccountDestination,
            value: 500
        });

        const lstBankAccountOrigin = await request.get(`/bank-account/unique/${numberAccountOrigin}`);
        const lstBankAccountDestination = await request.get(`/bank-account/unique/${numberAccountDestination}`);

        expect(lstBankAccountOrigin.status).toBe(200);
        expect(lstBankAccountOrigin.body[0]).toHaveProperty('number_account');
        expect(lstBankAccountOrigin.body[0]).toHaveProperty('balance');
        expect(parseFloat(lstBankAccountOrigin.body[0].balance)).toBe(500);

        expect(lstBankAccountDestination.status).toBe(200);
        expect(lstBankAccountDestination.body[0]).toHaveProperty('number_account');
        expect(lstBankAccountDestination.body[0]).toHaveProperty('balance');
        expect(parseFloat(lstBankAccountDestination.body[0].balance)).toBe(1500);

    }, timeout);

    it('Get all transactions', async () => {
        const response = await request.get('/transaction/all');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('transactions');
        expect(response.body.transactions).toBeInstanceOf(Array);
        expect(response.body.transactions.length).toBe(3);
    } , timeout);

    it('Delete a bank account origin', async () => {
        const response = await request.delete(`/bank-account/delete/${numberAccountOrigin}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Bank account deleted');
    }
    , timeout);

    it('Delete a bank account destination', async () => {
        const response = await request.delete(`/bank-account/delete/${numberAccountDestination}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Bank account deleted');
    })
});




