import { ValidationChain, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { body, query, param } from 'express-validator';
export class ValidatorUtil {
    static validateFields = (validations: ValidationChain[]) => async (request: Request, response: Response, next: NextFunction) => {
      await Promise.all(validations.map(validation => validation.run(request)));
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }
      next();
    };
  }
  
  