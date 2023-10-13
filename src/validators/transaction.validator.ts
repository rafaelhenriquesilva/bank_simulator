import { ValidationChain, validationResult } from 'express-validator';
import { body, query, param } from 'express-validator';
import { ValidatorUtil } from '../utils/validator.util';
export class TransactionValidator {

    static createTransactionValidator() {
        let numberAccountNotEmpty = body('number_account_origin').notEmpty().withMessage('Number account cannot be empty');
        let value = body('value').notEmpty().withMessage('value cannot be empty');
        let valueMoreThanZero = body('value').isFloat({ min: 0 }).withMessage('value must be more than zero');
        return ValidatorUtil.validateFields([
            numberAccountNotEmpty,
            value, 
            valueMoreThanZero
        ]);
    }

    
}