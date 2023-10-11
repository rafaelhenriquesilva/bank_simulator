
import { ValidatorUtil } from "../../utils/validator.util";


describe('ValidatorUtil tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('validator fields not empty type body', async () => {
        let requiredFields = ['username', 'password'];
        let bodyType = 'body';
        let validatorFieldsNotEmpty = ValidatorUtil.validatorFieldsNotEmpty(requiredFields, bodyType);
        
        expect(validatorFieldsNotEmpty).not.toBeNull();
    });

    it('validator fields not empty type query', async () => {
        let requiredFields = ['username', 'password'];
        let bodyType = 'query';
        let validatorFieldsNotEmpty = ValidatorUtil.validatorFieldsNotEmpty(requiredFields, bodyType);
        
        expect(validatorFieldsNotEmpty).not.toBeNull();
    });

    it('validator fields not empty type param', async () => {
        let requiredFields = ['username', 'password'];
        let bodyType = 'param';
        let validatorFieldsNotEmpty = ValidatorUtil.validatorFieldsNotEmpty(requiredFields, bodyType);
        
        expect(validatorFieldsNotEmpty).not.toBeNull();
    });
});
