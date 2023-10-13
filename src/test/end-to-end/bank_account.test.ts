import supertest from 'supertest';
import { App } from '../../app';
import BankAccount from '../../entities/BankAccount';
import { GlobalRepository } from '../../repositories/global.repository';


const appInstance = new App();
const app = appInstance.exportApp();

const request = supertest(app);
let timeout = (process.env.TEST_TIMEOUT || 10000) as number;
let numberAccount = 987654321;
describe('Bank Account action', () => {
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

    it('Get a bank account by number', async () => {
        const response = await request.get(`/bank-account/unique/${numberAccount}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('number_account');
        expect(response.body[0]).toHaveProperty('type');
        expect(response.body[0]).toHaveProperty('balance');

    }, timeout);

    it('Update a bank account', async () => {
        const response = await request.put(`/bank-account/update/${numberAccount}`).send({
            type: 'poupanca',
            balance: 2000
        });

        console.info(`bank account updated: ${JSON.stringify(response.body)}`);

        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty('number_account');
        expect(response.body[0]).toHaveProperty('type');
        expect(response.body[0]).toHaveProperty('balance');
        expect(response.body[0].type).toBe('poupanca');
        expect(parseFloat(response.body[0].balance)).toBe(2000);

    }, timeout);

    it('Get all bank accounts', async () => {
        const response = await request.get('/bank-account/all');

        expect(response.status).toBe(200);
    }, timeout);

    it('Delete a bank account', async () => {
        const response = await request.delete(`/bank-account/delete/${numberAccount}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Bank account deleted');
    }, timeout);
});




