import { QueryTypes } from "sequelize";
import TestAccount from "../../entities/TestAccount";
import { GlobalRepository } from "../../repositories/global.repository";
import { parse } from "dotenv";

let globalRepositoryWithTestAccountModel = new GlobalRepository(TestAccount);
let timeout = (process.env.TEST_TIMEOUT || 10000) as number;
describe('GlobalRepository methods', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    let data = {
        name: 'account_test_integration',
        age: 10
    } as TestAccount;

    let test_account = {} as TestAccount;

    it('call database with query', async () => {
        let globalRepository = new GlobalRepository(TestAccount);
        let query = 'SELECT * FROM test_account';
        let results = await globalRepository.executeQuery(query, QueryTypes.SELECT);

        
        expect(results).not.toBeNull(); 
    }, timeout);

    it('call database and create data', async () => {
        let results = await globalRepositoryWithTestAccountModel.createData(data);

        test_account = results as TestAccount;
        
        expect(results).not.toBeNull(); 
    });

    it('call database and get data', async () => {
        let results = await globalRepositoryWithTestAccountModel.getDataByParameters({
            'id': test_account['id']
        }) as TestAccount[];

        expect(results).not.toBeNull();
        expect(results[0].id).toBe(test_account['id']);
    }, timeout);

    it('call database and update data', async () => {
        let data = {
            age: 12
        } as TestAccount;

        let id = test_account['id']

        let dataToUpdate = await globalRepositoryWithTestAccountModel.updateData(data, {
            'id': id
        }) as any;
        
        expect(dataToUpdate).not.toBeNull();
        expect(dataToUpdate[0].age).toBe(12);
    }, timeout);

    it('call database and delete data', async () => {
        let results = await globalRepositoryWithTestAccountModel.deleteData(test_account['id']);

        expect(results).not.toBeNull();
    }, timeout);

});