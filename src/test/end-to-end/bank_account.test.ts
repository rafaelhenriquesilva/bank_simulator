import supertest from 'supertest';
import { App } from '../../app';
import BankAccount from '../../entities/BankAccount';


const appInstance = new App();
const app = appInstance.exportApp();

const request = supertest(app);
let timeout = (process.env.TEST_TIMEOUT || 10000) as number;
describe('Bank Account action', () => {
    beforeEach(() => {
        jest.clearAllMocks();
     });
   
    it('Create a bank account', async () => {
        const response = await request.post('/bank_account/create').send({
            number_account: 123456789,
            type: 'corrente',
            balance: 1000
        });

        console.info(`bank account created: ${JSON.stringify(response.body)}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('number_account');
        expect(response.body).toHaveProperty('type');
        expect(response.body).toHaveProperty('balance');
        
    }, timeout);

    it('Get a bank account by number', async () => {
        const response = await request.get('/bank_account/unique/123456789');

        console.info(`bank account: ${JSON.stringify(response.body)}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('number_account');
        expect(response.body[0]).toHaveProperty('type');
        expect(response.body[0]).toHaveProperty('balance');
        
    })

    it('Get all bank accounts', async () => {
        const response = await request.get('/bank_account/all');

        expect(response.status).toBe(200);
    });
});
    



