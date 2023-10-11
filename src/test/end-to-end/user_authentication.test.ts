import supertest from 'supertest';
import { App } from '../../app';
import { loginUser } from './helpers/login.helper';
import { GlobalRepository } from '../../repositories/global.repository';
import UserAuthentication from '../../entities/UserAuthentication';
import { PasswordUtil } from '../../utils/password.util';
const appInstance = new App();
const app = appInstance.exportApp();

const request = supertest(app);
const globalRepository = new GlobalRepository(UserAuthentication);

let timeout = (process.env.TEST_TIMEOUT || 10000) as number;

let userCredentials = {
  username: process.env.USER_TEST_USERNAME,
  password: process.env.USER_TEST_PASSWORD
} as any;

let token = '';

describe('User And Login Routes', () => {

  beforeEach(() => {
     jest.clearAllMocks();
  });

  it('Create user', async () => {
    
    let userAlreadyExist = await globalRepository
          .getDataByParameters({username: userCredentials.username}) as UserAuthentication[];

    if(userAlreadyExist.length > 0) {
      await globalRepository.deleteData(userAlreadyExist[0].id);
    }

    const user = await request.post('/user/create')
      .send({
        "username": userCredentials.username,
        "password": userCredentials.password
      })
      .set('Content-Type', 'application/json'); // Set the content-type header

      expect(user.body).not.toBeNull();
      expect(user.body.username).toBe(userCredentials.username);
      expect(user.body.password).not.toBe(userCredentials.password);
  }, timeout);

  it('Login user', async () => {
    const user = await loginUser(request, userCredentials.username, userCredentials.password);
    token = user.body.token;
    expect(user.body).not.toBeNull();
    expect(user.body.token).not.toBeNull();
    expect(user.body.token).not.toBeUndefined();
  }, timeout);

  it('Login user with invalid username', async () => {
    const invalidUser = await loginUser(request, 'invalid_username', userCredentials.password);

    expect(invalidUser.body).not.toBeNull();
    expect(invalidUser.body.errors).not.toBeNull();
    expect(invalidUser.body.errors[0]).toBe('User not found');

  }, timeout);

  it('Login user with invalid password', async () => {
    const invalidUser = await loginUser(request, userCredentials.username ,'invalid_password');

    expect(invalidUser.body).not.toBeNull();
    expect(invalidUser.body.errors).not.toBeNull();
    expect(invalidUser.body.errors[0]).toBe('Password not match');

  }, timeout);
  
  it('Login user: username and password with four characters', async () => {
    const invalidUser = await loginUser(request, 'user' ,'pass');

    expect(invalidUser.body).not.toBeNull();
    expect(invalidUser.body.errors).not.toBeNull();
    expect(invalidUser.body.errors[0].msg).toBe('Username must have minimum length of 8 characters');
    expect(invalidUser.body.errors[1].msg).toBe('Password must have minimum length of 8 characters');

  } , timeout);

  it('update user password', async () => {
    let newPassword = 'new_password';

    const response = await request.put('/user/update/password')
      .send({
        "username": userCredentials.username,
        "new_password": newPassword
      })
      .set('Content-Type', 'application/json') // Set the content-type header
      .set('Authorization', `Bearer ${token}`); // Set the content-type header

    let comparePassword = await PasswordUtil.comparePassword(newPassword, response.body[0].password);  

    expect(response.body).not.toBeNull();
    expect(response.body[0].username).toBe(userCredentials.username);
    expect(response.body[0].password).not.toBe(userCredentials.password);
    expect(comparePassword).toBe(true);
  });

 
});



