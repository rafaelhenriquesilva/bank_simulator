import supertest from 'supertest';
import { App } from '../../app';
import BankAccount from '../../entities/BankAccount';
import { GlobalRepository } from '../../repositories/global.repository';
import { loginUser } from './helpers/login.helper';
import UserAuthentication from '../../entities/UserAuthentication';

const appInstance = new App();
const app = appInstance.exportApp();
let userCredentials = {
    username: process.env.USER_TEST_USERNAME,
    password: process.env.USER_TEST_PASSWORD
} as any;
const request = supertest(app);
let timeout = (process.env.TEST_TIMEOUT || 10000) as number;
let numberAccount = 987654321;
let token = '';
let globalRepository = new GlobalRepository(UserAuthentication);
describe('Bank Account action', () => {
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

    it('Create a bank account', async () => {
        const response = await request.post('/bank-account/create').send({
            number_account: numberAccount,
            type: 'corrente',
            balance: 1000
        })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('number_account');
        expect(response.body).toHaveProperty('type');
        expect(response.body).toHaveProperty('balance');

    }, timeout);

    it('Get a bank account by number', async () => {
        const response = await request.get(`/bank-account/unique/${numberAccount}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);;

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
        })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        console.info(`bank account updated: ${JSON.stringify(response.body)}`);

        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty('number_account');
        expect(response.body[0]).toHaveProperty('type');
        expect(response.body[0]).toHaveProperty('balance');
        expect(response.body[0].type).toBe('poupanca');
        expect(parseFloat(response.body[0].balance)).toBe(2000);

    }, timeout);

    it('Get all bank accounts', async () => {
        const response = await request.get('/bank-account/all')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    }, timeout);

    it('Delete a bank account', async () => {
        const response = await request.delete(`/bank-account/delete/${numberAccount}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Bank account deleted');
    }, timeout);
});




