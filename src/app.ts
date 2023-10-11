import express, { Express, Request, Response } from 'express';

import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';

import dotenv from 'dotenv';
import { routes } from './routes';

export class App {
    
    private app: Express;
    constructor() {
        dotenv.config();
        this.app = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(helmet());
        this.app.use(cors());

    }

    routes() {
        this.app.use('/', routes);
    }

    exportApp() {
        return this.app;
    }
}

