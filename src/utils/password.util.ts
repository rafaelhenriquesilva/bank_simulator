import * as bcrypt from 'bcryptjs';
import { LoggerUtil } from './logger.util';
export class PasswordUtil {
  private static readonly saltRounds = 10;

  static async creatHashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      LoggerUtil.logError(`Error in creatHashPassword: ${JSON.stringify(error)}`, 'utils/password.util.ts', 'creatHashPassword');
      throw new Error('Erro ao criar o hash da senha');
    }
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(password, hash);
      return isMatch;
    } catch (error) {
      LoggerUtil.logError(`Error in comparePassword: ${JSON.stringify(error)}`, 'utils/password.util.ts', 'comparePassword');
      throw new Error('Erro ao comparar a senha com o hash');
    }
  }
}

