import winston from 'winston';

export class LoggerUtil {
    static logger = winston.createLogger({
        format: winston.format.json(),
        transports: [
            new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/combined.log', level: 'info' })
        ]
    });

    static logError(message: string | Record<string, any>, origin: string, stack: string) {
        const logObject = {
            Origin: origin,
            Error: `${message}`,
            Stack: stack,
            CreatedAt: new Date()
        };

        this.logger.error(JSON.stringify(logObject));
    }

    static logInfo(message: string | Record<string, any>, origin: string) {
        const logObject = {
            Origin: origin,
            Message: `${message}`,
            CreatedAt: new Date()
        };

        this.logger.info(JSON.stringify(logObject));
    }
}
