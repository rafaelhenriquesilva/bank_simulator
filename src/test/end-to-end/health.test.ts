import supertest from 'supertest';
import { App } from '../../app';
import { GlobalRepository } from '../../repositories/global.repository';
import Transaction from '../../entities/Transaction';

const appInstance = new App();
const app = appInstance.exportApp();

const request = supertest(app);
let timeout = (process.env.TEST_TIMEOUT || 10000) as number;
describe('Health App', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Health check', async () => {
        const response = await request.get('/health');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toBe('OK');
    }, timeout);
});




