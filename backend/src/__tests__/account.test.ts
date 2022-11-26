/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

 import supertest from 'supertest';
import app from '../app';

 const API_URL = '/api/v1';

 describe('Account routes', () => {
  let token: string;

  beforeAll(async () => {
    const MOCK_USER = {
      username: 'ngcash',
      password: 'Asdf1234',
    };

    const { body } = await supertest(app)
      .post(`${API_URL}/signup`)
      .send(MOCK_USER)
      .expect('Content-Type', /json/)
      .expect(201);

    token = body.token;
  });

  it('User should get account id and balance with token', async () => {
    const { body } = await supertest(app)
    .get(`${API_URL}/account`)
    .set('Authorization', token)
    .expect('Content-Type', /json/)
    .expect(200);

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('balance');
    expect(body.balance).toEqual(100);
  });

  it('User should get an error to get account if no token is passed', async () => {
    const MOCK_ERROR_MESSSAGE = 'token not found';

    const { body: { message } } = await supertest(app)
      .get(`${API_URL}/account`)
      .expect('Content-Type', /json/)
      .expect(401);

    expect(message).toEqual(MOCK_ERROR_MESSSAGE);
  });

  it('User should get an error to get account if token is invalid', async () => {
    const MOCK_ERROR_MESSSAGE = 'invalid token';

    const { body: { message } } = await supertest(app)
      .get(`${API_URL}/account`)
      .set('Authorization', 'invalid_token')
      .expect('Content-Type', /json/)
      .expect(401);

    expect(message).toEqual(MOCK_ERROR_MESSSAGE);
  });
})
