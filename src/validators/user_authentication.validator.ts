import { ValidationChain, validationResult } from 'express-validator';
import { body, query, param } from 'express-validator';
import { ValidatorUtil } from '../utils/validator.util';
export class UserAuthenticationValidator {

    static createUserAndLoginValidator() {
        let usernameValidatorNotEmpty = body('username').notEmpty().withMessage('Username cannot be empty');
        let passwordValidatorNotEmpty = body('password').notEmpty().withMessage('Password cannot be empty');
        let usernameValidatorMin8 = body('username').isLength({ min: 8 }).withMessage('Username must have minimum length of 8 characters');
        let passwordValidatorMin8 = body('password').isLength({ min: 8 }).withMessage('Password must have minimum length of 8 characters');

        return ValidatorUtil.validateFields([usernameValidatorNotEmpty, passwordValidatorNotEmpty, usernameValidatorMin8, passwordValidatorMin8]);
    }

    static updatePasswordValidator() {
        let newPasswordValidatorNotEmpty = body('new_password').notEmpty().withMessage('Password cannot be empty');
        let newPasswordValidatorMin8 = body('new_password').isLength({ min: 8 }).withMessage('Password must have minimum length of 8 characters');
        let usernameValidatorNotEmpty = body('username').notEmpty().withMessage('Username cannot be empty');
        
        return ValidatorUtil.validateFields([newPasswordValidatorNotEmpty, newPasswordValidatorMin8, usernameValidatorNotEmpty]);
    }


    
}