
export class ErrorUtil {
    static async handleErrorsIfContains(promise: Promise<any>) {
        try {
            return await promise;
        } catch (error) {
            // Tratamento de erros comuns, como logs ou notificações
            throw error;
        }
    }
}