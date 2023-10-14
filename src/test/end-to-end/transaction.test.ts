import supertest from 'supertest';
import { App } from '../../app';
import { GlobalRepository } from '../../repositories/global.repository';
import Transaction from '../../entities/Transaction';
import UserAuthentication from '../../entities/UserAuthentication';
import { loginUser } from './helpers/login.helper';

const appInstance = new App();
const app = appInstance.exportApp();

const request = supertest(app);
let userCredentials = {
    username: process.env.USER_TEST_USERNAME,
    password: process.env.USER_TEST_PASSWORD
} as any;
let timeout = (process.env.TEST_TIMEOUT || 10000) as number;
let numberAccountOrigin = 222333444;
let numberAccountDestination = 555666777;
let globalRepository = new GlobalRepository(UserAuthentication);
let token = '';
describe('Transactions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Create user', async () => {

        await globalRepository.deleteAllData();

        const user = await request.post('/user/create')
            .send({
                "username": userCredentials.username,
                "password": userCredentials.password
            })
            .set('Content-Type', 'application/json'); // Set the content-type header

        expect(user.body).not.toBeNull();
        expect(user.body.username).toBe(userCredentials.username);
        expect(user.body.password).not.toBe(userCredentials.password);
    }, timeout);

    it('Login user', async () => {
        const user = await loginUser(request, userCredentials.username, userCredentials.password);
        token = user.body.token;
        expect(user.body).not.toBeNull();
        expect(user.body.token).not.toBeNull();
        expect(user.body.token).not.toBeUndefined();
    }, timeout);

    it('Create a bank account origin', async () => {
        const response = await request.post('/bank-account/create').send({
            number_account: numberAccountOrigin,
            type: 'corrente',
            balance: 1000
        }).set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

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
        }).set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

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
        }).set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        const lstBankAccount = await request.get(`/bank-account/unique/${numberAccountOrigin}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(lstBankAccount.status).toBe(200);
        expect(lstBankAccount.body[0]).toHaveProperty('number_account');
        expect(lstBankAccount.body[0]).toHaveProperty('balance');
        expect(parseFloat(lstBankAccount.body[0].balance)).toBe(500);

    }, timeout);

    it('Withdraw and not found bank account', async () => {
        const withdraw = await request.post('/transaction/withdraw').send({
            number_account_origin: 2222222222,
            value: 500
        }).set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(withdraw.status).toBe(404);
        expect(withdraw.body).toHaveProperty('message');
        expect(withdraw.body.message).toBe('Bank account not found');
    }, timeout);

    it('Inssuficient balance', async () => {
        let value = 600
        const withdraw = await request.post('/transaction/withdraw').send({
            number_account_origin: numberAccountOrigin,
            value: value
        }).set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(withdraw.status).toBe(400);
        expect(withdraw.body).toHaveProperty('errors');
        expect(withdraw.body.errors[0]).toBe(`Insufficient balance: number_account=${numberAccountOrigin} / value=${value}`);

    }, timeout);

    it('Deposit 500 of account', async () => {
        const deposit = await request.post('/transaction/deposit').send({
            number_account_origin: numberAccountOrigin,
            value: 500
        }).set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        const lstBankAccount = await request.get(`/bank-account/unique/${numberAccountOrigin}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(lstBankAccount.status).toBe(200);
        expect(lstBankAccount.body[0]).toHaveProperty('number_account');
        expect(lstBankAccount.body[0]).toHaveProperty('balance');
        expect(parseFloat(lstBankAccount.body[0].balance)).toBe(1000);

    }, timeout);

    it('deposit and not found bank account', async () => {
        const deposit = await request.post('/transaction/deposit').send({
            number_account_origin: 2222222222,
            value: 500
        }).set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(deposit.status).toBe(404);
        expect(deposit.body).toHaveProperty('message');
        expect(deposit.body.message).toBe('Bank account not found');
    }, timeout);

    it('Transfer 500 of account origin to account destination', async () => {
        const transfer = await request.post('/transaction/transfer').send({
            number_account_origin: numberAccountOrigin,
            number_account_destination: numberAccountDestination,
            value: 500
        }).set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        const lstBankAccountOrigin = await request.get(`/bank-account/unique/${numberAccountOrigin}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        const lstBankAccountDestination = await request.get(`/bank-account/unique/${numberAccountDestination}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

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
        const response = await request.get('/transaction/all')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('transactions');
        expect(response.body.transactions).toBeInstanceOf(Array);
        expect(response.body.transactions.length).toBe(3);
    }, timeout);

    it('Get transactions by type transferencia', async () => {
        const response = await request.get('/transaction/type/transferencia')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('transactions');
        expect(response.body.transactions).toBeInstanceOf(Array);
        expect(response.body.transactions.length).toBe(1);
    }, timeout);

    it('Delete a bank account origin', async () => {
        const response = await request.delete(`/bank-account/delete/${numberAccountOrigin}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Bank account deleted');
    }
        , timeout);

    it('Delete a bank account destination', async () => {
        const response = await request.delete(`/bank-account/delete/${numberAccountDestination}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Bank account deleted');
    }, timeout)
});




