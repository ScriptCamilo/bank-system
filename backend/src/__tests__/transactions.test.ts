/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import supertest from 'supertest';
import app from '../app';

let userToken: string;
let creditedUserToken: string;

const API_URL = '/api/v1';
const USERNAME = 'ngcash';
const CREDITED_USERNAME = 'ngcredited';

async function beforeAllCallback() {
  const MOCK_USER = {
    username: USERNAME,
    password: 'Asdf1234',
  };
  const MOCK_CREDITED_USER = {
    username: CREDITED_USERNAME,
    password: 'Aadsf4123'
  }

  const { body } = await supertest(app)
    .post(`${API_URL}/signup`)
    .send(MOCK_USER)
    .expect('Content-Type', /json/)
    .expect(201);

  const { body: creditedBody } = await supertest(app)
    .post(`${API_URL}/signup`)
    .send(MOCK_CREDITED_USER)
    .expect('Content-Type', /json/)
    .expect(201);

  userToken = body.token;
  creditedUserToken = creditedBody.token;
}

describe('Transaction routes', () => {
  beforeAll(beforeAllCallback);

  describe('POST request', () => {
    it('User should make a successful transaction', async () => {
      const CASH_OUT = {
        credited_user: CREDITED_USERNAME,
        cash_out: 20,
      };

      const { body } = await supertest(app)
        .post(`${API_URL}/transactions/cash-out`)
        .set('Authorization', userToken)
        .send(CASH_OUT)
        .expect('Content-Type', /json/)
        .expect(200);

      const { body: { balance } } = await supertest(app)
        .get(`${API_URL}/account`)
        .set('Authorization', userToken)
        .expect('Content-Type', /json/)
        .expect(200);

      const { body: { balance: creditedBalance } } = await supertest(app)
        .get(`${API_URL}/account`)
        .set('Authorization', creditedUserToken)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('debitedAccountId');
      expect(body).toHaveProperty('creditedAccountId');
      expect(body).toHaveProperty('createdAt');
      expect(body.value).toEqual(CASH_OUT.cash_out);

      expect(balance).toEqual(80);
      expect(creditedBalance).toEqual(120);
    });

    it('User should get an error if credited user is not found', async () => {
      const MOCK_ERROR_MESSSAGE = 'credited user not found';
      const CASH_OUT = {
        credited_user: 'wrong_user',
        cash_out: 20,
      };

      const { body: { message } } = await supertest(app)
        .post(`${API_URL}/transactions/cash-out`)
        .set('Authorization', userToken)
        .send(CASH_OUT)
        .expect('Content-Type', /json/)
        .expect(400);


      expect(message).toEqual(MOCK_ERROR_MESSSAGE);
    });

    it('User should get an error if it tries to debit a value greater than its balance', async () => {
      const MOCK_ERROR_MESSSAGE = 'insufficient balance';
      const CASH_OUT = {
        credited_user: CREDITED_USERNAME,
        cash_out: 105,
      };

      const { body: { message } } = await supertest(app)
        .post(`${API_URL}/transactions/cash-out`)
        .set('Authorization', userToken)
        .send(CASH_OUT)
        .expect('Content-Type', /json/)
        .expect(400);


      expect(message).toEqual(MOCK_ERROR_MESSSAGE);
    });

    it('User should get an error if it tries to credit itself', async () => {
      const MOCK_ERROR_MESSSAGE = 'debited and credited user cannot be the same';
      const CASH_OUT = {
        credited_user: USERNAME,
        cash_out: 40,
      };

      const { body: { message } } = await supertest(app)
        .post(`${API_URL}/transactions/cash-out`)
        .set('Authorization', userToken)
        .send(CASH_OUT)
        .expect('Content-Type', /json/)
        .expect(409);


      expect(message).toEqual(MOCK_ERROR_MESSSAGE);
    });

    it('User should get an error if body request dons\`t have a credited_user field', async () => {
      const MOCK_ERROR_MESSSAGE = '"credited_user" is required';
      const CASH_OUT = {
        cash_out: 105,
      };

      const { body: { message } } = await supertest(app)
        .post(`${API_URL}/transactions/cash-out`)
        .set('Authorization', userToken)
        .send(CASH_OUT)
        .expect('Content-Type', /json/)
        .expect(400);


      expect(message).toEqual(MOCK_ERROR_MESSSAGE);
    });

    it('User should get an error if body request dons\`t have a cash_out field', async () => {
      const MOCK_ERROR_MESSSAGE = '"cash_out" is required';
      const CASH_OUT = {
        credited_user: CREDITED_USERNAME,
      };

      const { body: { message } } = await supertest(app)
        .post(`${API_URL}/transactions/cash-out`)
        .set('Authorization', userToken)
        .send(CASH_OUT)
        .expect('Content-Type', /json/)
        .expect(400);


      expect(message).toEqual(MOCK_ERROR_MESSSAGE);
    });

    it('User should get an error making transaction with no token', async () => {
      const MOCK_ERROR_MESSSAGE = 'token not found';
      const CASH_OUT = {
        credited_user: CREDITED_USERNAME,
        cash_out: 20,
      };

      const { body: { message } } = await supertest(app)
        .post(`${API_URL}/transactions/cash-out`)
        .send(CASH_OUT)
        .expect('Content-Type', /json/)
        .expect(401);


      expect(message).toEqual(MOCK_ERROR_MESSSAGE);
    });

    it('User should get an error making transaction if token is invalid', async () => {
      const MOCK_ERROR_MESSSAGE = 'invalid token';
      const CASH_OUT = {
        credited_user: CREDITED_USERNAME,
        cash_out: 20,
      };

      const { body: { message } } = await supertest(app)
        .post(`${API_URL}/transactions/cash-out`)
        .set('Authorization', 'invalid_token')
        .send(CASH_OUT)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(message).toEqual(MOCK_ERROR_MESSSAGE);
    });
  });

  describe('GET request', () => {
    it('Credited user should have increased 20 of cash from 100', async () => {
      const { body } = await supertest(app)
        .get(`${API_URL}/account`)
        .set('Authorization', creditedUserToken)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.balance).toEqual(120);
    });

    it('User should have decreased 20 of cash from 100', async () => {
      const { body } = await supertest(app)
        .get(`${API_URL}/account`)
        .set('Authorization', userToken)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.balance).toEqual(80);
    });

    it('User and credited user should have a transaction', async () => {
      const body = await supertest(app)
        .get(`${API_URL}/transactions`)
        .set('Authorization', userToken)
        .expect('Content-Type', /json/)
        .expect(200);

      const creditedBody = await supertest(app)
        .get(`${API_URL}/transactions`)
        .set('Authorization', creditedUserToken)
        .expect('Content-Type', /json/)
        .expect(200);

      if (Array.isArray(body)) {
        const userBody = body[0];

        expect(body).toHaveLength(1);
        expect(userBody).toHaveProperty('id');
        expect(userBody).toHaveProperty('debitedAccountId');
        expect(userBody).toHaveProperty('creditedAccountId');
        expect(userBody).toHaveProperty('value');
        expect(userBody).toHaveProperty('createdAt');

        expect(userBody.value).toEqual(20);
      }

      if (Array.isArray(creditedBody)) {
        const creditedUserBody = creditedBody[0];

        expect(creditedBody).toHaveLength(1);
        expect(creditedUserBody).toHaveProperty('id');
        expect(creditedUserBody).toHaveProperty('debitedAccountId');
        expect(creditedUserBody).toHaveProperty('creditedAccountId');
        expect(creditedUserBody).toHaveProperty('value');
        expect(creditedUserBody).toHaveProperty('createdAt');

        expect(creditedUserBody.value).toEqual(20);
      }
    })
  });
})
