import { ValidationChain, validationResult } from 'express-validator';
import { body, query, param } from 'express-validator';
import { ValidatorUtil } from '../utils/validator.util';
export class BankAccountValidator {

    static createBankAccountValidator() {
        let numberAccountNotEmpty = body('number_account').notEmpty().withMessage('Number account cannot be empty');
        let typeNotEmpty = body('type').notEmpty().withMessage('Type cannot be empty, values: [corrente, poupanca]');
        let balance = body('balance').notEmpty().withMessage('Balance cannot be empty');
        let numberAccountMin8 = body('number_account').isLength({ min: 7 }).withMessage('Number account must have minimum length of 7 characters');
        let numberAccountMax20 = body('number_account').isLength({ max: 20 }).withMessage('Number account must have maximum length of 20 characters');
        let balanceMoreThanZero = body('balance').isFloat({ min: 0 }).withMessage('Balance must be more than zero');
        return ValidatorUtil.validateFields([
            numberAccountNotEmpty, 
            typeNotEmpty, 
            balance, 
            numberAccountMin8, 
            numberAccountMax20, 
            balanceMoreThanZero
        ]);
    }

    static updateUserValidator() {
        
        let numberAccountNotEmpty = param('number_account').notEmpty().withMessage('Number account cannot be empty');
        let typeNotEmpty = body('type').optional().notEmpty().withMessage('Type cannot be empty, values: [corrente, poupanca]');
        let balance = body('balance').optional().notEmpty().withMessage('Balance cannot be empty');
        let numberAccountMin8 = param('number_account').isLength({ min: 7 }).withMessage('Number account must have minimum length of 7 characters');
        let numberAccountMax20 = param('number_account').isLength({ max: 20 }).withMessage('Number account must have maximum length of 20 characters');
        let balanceMoreThanZero = body('balance').isFloat({ min: 0 }).withMessage('Balance must be more than zero');
        return ValidatorUtil.validateFields([
            numberAccountNotEmpty, 
            typeNotEmpty, 
            balance, 
            numberAccountMin8, 
            numberAccountMax20, 
            balanceMoreThanZero
        ]);
    }

    
}