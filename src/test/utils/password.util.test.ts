import { PasswordUtil } from "../../utils/password.util";

let password = '123456';
describe('PasswordUtil', () => {
    it('should return true when password is valid', async () => {
        let passwordHash = await PasswordUtil.creatHashPassword(password);

        let isMatch = await PasswordUtil.comparePassword(password, passwordHash);

        expect(isMatch).toBe(true);
    });
});