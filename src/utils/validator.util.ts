import { ValidationChain, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { body, query, param } from 'express-validator';
export class ValidatorUtil {
  static validatorFieldsNotEmpty(requiredFields: Array<string>, bodyType: string) {
    const validationRequiredFields: ValidationChain[] = [];

    for (const field of requiredFields) {
        const fieldValidations: ValidationChain[] = this.fieldNotEmpty(field, bodyType);
        validationRequiredFields.push(...fieldValidations);
    }

    return ValidatorUtil.validateFields(validationRequiredFields);
}

static fieldNotEmpty(field: string, bodyType: string): ValidationChain[] {
    const fieldFormatted = field.replace(/([A-Z])/g, ' $1').trim();
    let methodValidator = null;

    switch (bodyType) {
        case 'body':
            methodValidator = body(fieldFormatted).notEmpty().withMessage(`${fieldFormatted} cannot be empty`);
            break;
        case 'query':
            methodValidator = query(fieldFormatted).notEmpty().withMessage(`${fieldFormatted} cannot be empty`);
            break;
        case 'param':
            methodValidator = param(fieldFormatted).notEmpty().withMessage(`${fieldFormatted} cannot be empty`);
            break;
        default:
            break;
    }

    return methodValidator ? [methodValidator] : [];
}


    static validateFields = (validations: ValidationChain[]) => async (request: Request, response: Response, next: NextFunction) => {
      await Promise.all(validations.map(validation => validation.run(request)));
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }
      next();
    };
  }
  
  