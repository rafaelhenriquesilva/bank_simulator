import UserAuthentication from "../entities/UserAuthentication";
import { GlobalRepository } from "../repositories/global.repository";
import { LoggerUtil } from "../utils/logger.util";
import { PasswordUtil } from "../utils/password.util";

export class UserAuthenticationHelper {
    

    static verifyUserNotExists(user: UserAuthentication[], errors: Array<string>) {
        if(user.length == 0){
            LoggerUtil.logError(`User not found: ${JSON.stringify(user)}` , 'helpers/user_authentication.helper.ts', 'verifyUserNotExists');
            errors.push('User not found');
        } 
    }

    static async verifyUserExists(user: UserAuthentication[], errors: Array<string>) {
        if(user.length > 0){
            LoggerUtil.logError(`User already exists: ${JSON.stringify(user)}` , 'helpers/user_authentication.helper.ts', 'verifyUserExists');
            errors.push('User already exists');
        }
    }

    static async verifyPasswordIsMatch(user: UserAuthentication[], body: any, errors: Array<string>) {
        if (user.length > 0 && user[0].is_active) {
            //Compare password
            let comparePassword = await PasswordUtil.comparePassword(body.password, user[0].password);

            if (!comparePassword) {
                LoggerUtil.logError(`Password not match: ${JSON.stringify(user)}` , 'helpers/user_authentication.helper.ts', 'verifyPasswordIsMatch');
                errors.push('Password not match');
            }
        }
    }

    static async  getDataWhereCondition(model: any, whereCondition: any){
        let globalRepository = new GlobalRepository(model);
        let data = await globalRepository.getDataByParameters(
            whereCondition
        );
        return data;
    }

    static async verifyUserIsActive(user: UserAuthentication[], errors: Array<string>) {
        if(user.length > 0 && !user[0].is_active){
            LoggerUtil.logError(`User not active: ${JSON.stringify(user)}` , 'helpers/user_authentication.helper.ts', 'verifyUserIsActive');
            errors.push('User not active');
        }
    }

    static async updateData(model: any, whereCondition: any, data: any){
        let globalRepository = new GlobalRepository(model);
        let dataUpdated = await globalRepository.updateData(data, whereCondition);
        return dataUpdated;
    }

    static createUserData(body: any, encryptPassword: string){
        let data = {
            username: body.username,
            password: encryptPassword,
            created_at: new Date(),
            updated_at: new Date(),
            is_active: true
        } as UserAuthentication;
        return data;
    }
}