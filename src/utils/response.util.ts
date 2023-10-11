export class ResponseUtil {
    static showErrorsOrExecuteFunction(errors: Array<string>, response: any, callback: any) {
        if (errors.length > 0) {
            return response.status(400).json({
                message: 'Error',
                errors: errors
            });
        } else {
            callback();
        }
    }
}