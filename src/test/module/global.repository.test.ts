import { QueryTypes } from "sequelize";
import { GlobalRepository } from "../../repositories/global.repository";

let timeout = (process.env.TEST_TIMEOUT || 10000) as number;
describe('GlobalRepository methods', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('call database with query', async () => {
        let globalRepository = new GlobalRepository(null);
        let query = 'SELECT * FROM bank_account';
        let results = await globalRepository.executeQuery(query, QueryTypes.SELECT);


        expect(results).not.toBeNull();
    }, timeout);
});