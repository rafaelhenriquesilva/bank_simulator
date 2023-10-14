import { ValidationChain, validationResult } from 'express-validator';
import { body, query, param } from 'express-validator';
import { ValidatorUtil } from '../utils/validator.util';
export class TransactionValidator {

    static createTransactionValidator() {
        let numberAccountNotEmpty = body('number_account_origin').notEmpty().withMessage('Number account cannot be empty');
        let value = body('value').isNumeric().notEmpty().withMessage('value cannot be empty');
        let valueMoreThanZero = body('value').isNumeric().isFloat({ min: 0 }).withMessage('value must be more than zero');
        return ValidatorUtil.validateFields([
            numberAccountNotEmpty,
            value, 
            valueMoreThanZero
        ]);
    }

    static createTransferValidator() {
        let numberAccountOriginNotEmpty = body('number_account_origin').notEmpty().withMessage('Number account origin cannot be empty');
        let numberAccountDestinationNotEmpty = body('number_account_destination').notEmpty().withMessage('Number account destination cannot be empty');
        let value = body('value').isNumeric().notEmpty().withMessage('value cannot be empty');
        let valueMoreThanZero = body('value').isNumeric().isFloat({ min: 0 }).withMessage('value must be more than zero');
        return ValidatorUtil.validateFields([
            numberAccountOriginNotEmpty,
            numberAccountDestinationNotEmpty,
            value, 
            valueMoreThanZero
        ]);
    }

    static getTransactionByTypeValidator() {
        // Verificar se o type não está vazio e se é um dos tipos válidos: saque, deposito, transferencia
        let typeNotEmpty = param('type').notEmpty().withMessage('Type cannot be empty');
        let typeValid = param('type').isIn(['saque', 'deposito', 'transferencia']).withMessage('Type must be one of the following: saque, deposito, transferencia');

        return ValidatorUtil.validateFields([
            typeNotEmpty,
            typeValid
        ]);
    }

    
}