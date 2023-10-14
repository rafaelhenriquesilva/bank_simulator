import { Request, Response, NextFunction, response } from 'express';
import { JwtUtil } from '../utils/jwt.util';
import { ICustomRequest } from '../interfaces/ICustomRequest';
import { LoggerUtil } from '../utils/logger.util';
import { ResponseUtil } from '../utils/response.util';


export const verifyTokenMiddleware = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    LoggerUtil.logInfo('Iniciando o middleware auth', 'middlewares/auth.middleware.ts');
    const headers = req['headers'];
    let token = headers['authorization']; 
    let errors: any[] = [];

    if (!token) {
      LoggerUtil.logError('Token not received!', 'middlewares/auth.middleware.ts', 'verifyTokenMiddleware');
      errors.push('Token not received!');
    }else {
      token = token.replace('Bearer ', '').trim();
    }
    
    await JwtUtil.verifyJwtToken(token as string);
    req.userId = JwtUtil.getIdFromToken(token as string); 
  
    ResponseUtil.showErrorsOrExecuteFunction(errors, response, () => next());
} catch (error) {
    LoggerUtil.logError('Invalid Token!', 'middlewares/auth.middleware.ts', 'verifyTokenMiddleware');
    return res.status(401).json({ message: 'Invalid Token!' });
  }
};