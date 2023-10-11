import { Request, Response, Router } from 'express';
import { LoggerUtil } from '../../utils/logger.util';

const healthRoute = Router();

export class HealthRoute {
  constructor() {

  }
  
  public async init() {
    LoggerUtil.logInfo('Starting HealthRoute', 'routes/health/health.route.ts');
    healthRoute.get('/', this.getHealth);
  }

  public async getHealth(req: Request, res: Response) {
    LoggerUtil.logInfo('Starting getHealth', 'routes/health/health.route.ts');
    res.status(200).json({ status: 'OK' });
  }

  getRoute() {
    return healthRoute;
  }
}

