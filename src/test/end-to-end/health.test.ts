import supertest from 'supertest';
import { App } from '../../app';

const appInstance = new App();
const app = appInstance.exportApp();

const request = supertest(app);

describe('health', () => {
    it('route to verify project online', async () => {
        const response = await request.get('/health');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toBe('OK');
    }
    );
});
    



