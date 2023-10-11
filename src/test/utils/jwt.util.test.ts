import { JwtUtil } from "../../utils/jwt.util";

let token = '';
describe('JWTUtil', () => {
    it('generate JWT TOKEN', async () => {
        let id = 1;
        token = await JwtUtil.generateJwtToken(id);

        expect(token).not.toBeNull();
    });

    it('verify JWT TOKEN', async () => {
        let verify = await JwtUtil.verifyJwtToken(token);

        expect(verify).toBeTruthy();
    });
    
    it('get id from token', async () => {
        let id = JwtUtil.getIdFromToken(token);

        expect(id).not.toBeNull();
        expect(id).toBe(1);
    });
});