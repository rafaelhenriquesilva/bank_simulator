import { Request, Response, Router } from 'express';
import { UserAuthenticationService } from '../../service/user_authentication.service';
import { verifyTokenMiddleware } from '../../middlewares/auth.middleware';
import { LoggerUtil } from '../../utils/logger.util';
import { UserAuthenticationValidator } from '../../validators/user_authentication.validator';

const userRoute = Router();

export class UserRoute {
  
  public async init() {
    LoggerUtil.logInfo('Starting UserRoute', 'routes/user/user.route.ts');
    userRoute.post('/create', UserAuthenticationValidator.createUserAndLoginValidator() ,this.createUser);
    userRoute.put('/update/password', verifyTokenMiddleware ,UserAuthenticationValidator.updatePasswordValidator() ,this.updatePassword);
  }

  public async createUser(request: Request, response: Response) {
    LoggerUtil.logInfo('Starting createUser', 'routes/user/user.route.ts');
    const userAuthenticationService = new UserAuthenticationService();
    await userAuthenticationService.createUser(request, response);
  }

  public async updatePassword(request: Request, response: Response) {
    LoggerUtil.logInfo('Starting updatePassword', 'routes/user/user.route.ts');
    const userAuthenticationService = new UserAuthenticationService();
    await userAuthenticationService.updatePassword(request, response);
  }

  getRoute() {
    return userRoute;
  }
}

