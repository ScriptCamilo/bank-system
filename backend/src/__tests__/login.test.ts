/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import supertest from 'supertest';
import app from '../app';

const API_URL = '/api/v1';

describe('Login routes', () => {
  it('User should receive an error if username is less than 3 characters long', async () => {
    const MOCK_ERROR_MESSSAGE = '"username" length must be at least 3 characters long';
    const MOCK_USER = {
      username: 'ng',
      password: 'Asdf1234',
    };

    const { body: { message } } = await supertest(app)
      .post(`${API_URL}/signup`)
      .send(MOCK_USER)
      .expect('Content-Type', /json/)
      .expect(400);

      expect(message).toEqual(MOCK_ERROR_MESSSAGE);
  });

  it('User should receive an error if body request doesn\`t have an username field', async () => {
    const MOCK_ERROR_MESSSAGE = '"username" is required';
    const MOCK_USER = {
      password: 'Asdf1234',
    };

    const { body: { message } } = await supertest(app)
      .post(`${API_URL}/signup`)
      .send(MOCK_USER)
      .expect('Content-Type', /json/)
      .expect(400);

      expect(message).toEqual(MOCK_ERROR_MESSSAGE);
  });

  it('User should receive an error if body request doesn\`t have a password field', async () => {
    const MOCK_ERROR_MESSSAGE = '"password" is required';
    const MOCK_USER = {
      username: 'ngpassword',
    };

    const { body: { message } } = await supertest(app)
      .post(`${API_URL}/signup`)
      .send(MOCK_USER)
      .expect('Content-Type', /json/)
      .expect(400);

      expect(message).toEqual(MOCK_ERROR_MESSSAGE);
  });

  it('User should receive an error if password is less than 8 characters long', async () => {
    const MOCK_ERROR_MESSSAGE = '"password" length must be at least 8 characters long';
    const MOCK_USER = {
      username: 'ngpass',
      password: 'Asdf123',
    };

    const { body: { message } } = await supertest(app)
      .post(`${API_URL}/signup`)
      .send(MOCK_USER)
      .expect('Content-Type', /json/)
      .expect(400);

      expect(message).toEqual(MOCK_ERROR_MESSSAGE);
  });

  it('User should receive an error if password is less than 8 characters long', async () => {
    const MOCK_ERROR_MESSSAGE = '"password" length must be at least 8 characters long';
    const MOCK_USER = {
      username: 'ngpass',
      password: 'Asdf123',
    };

    const { body: { message } } = await supertest(app)
      .post(`${API_URL}/signup`)
      .send(MOCK_USER)
      .expect('Content-Type', /json/)
      .expect(400);

      expect(message).toEqual(MOCK_ERROR_MESSSAGE);
  });

  it('User should receive an error if password doesn\'t have one number or one upper case letter', async () => {
    const MOCK_ERROR_MESSSAGE = '"password" must have at least one number and one upper case letter';
    const MOCK_USER_LETTER = {
      username: 'ngletter',
      password: 'asdf1234',
    };
    const MOCK_USER_NUMBER = {
      username: 'ngnumber',
      password: 'Asdfasdf',
    };

    const { body: { message: messageLetter } } = await supertest(app)
      .post(`${API_URL}/signup`)
      .send(MOCK_USER_LETTER)
      .expect('Content-Type', /json/)
      .expect(400);

    const { body: { message: messageNumber } } = await supertest(app)
    .post(`${API_URL}/signup`)
    .send(MOCK_USER_NUMBER)
    .expect('Content-Type', /json/)
    .expect(400);

    expect(messageLetter).toEqual(MOCK_ERROR_MESSSAGE);
    expect(messageNumber).toEqual(MOCK_ERROR_MESSSAGE);
  });

  it('User should create new account with username and password', async () => {
    const MOCK_USER = {
      username: 'ngcash',
      password: 'Asdf1234',
    };

    const { body } = await supertest(app)
      .post(`${API_URL}/signup`)
      .send(MOCK_USER)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(body).toHaveProperty('token');
  });

  it('User should create a new account and make login with no errors', async () => {
    const MOCK_USER = {
      username: 'newuser',
      password: 'Asdf1234'
    };

    await supertest(app)
      .post(`${API_URL}/signup`)
      .send(MOCK_USER)
      .expect('Content-Type', /json/)
      .expect(201);

    const { body } = await supertest(app)
      .post(`${API_URL}/login`)
      .send(MOCK_USER)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(body).toHaveProperty('token');
  });

  it('User should receive an unauthorized error because wrong credentials', async () => {
    const MOCK_MESSAGE = 'username or password is invalid';
    const MOCK_USER = {
      username: 'ngcredential',
      password: 'Asdf1234',
    };

    await supertest(app)
      .post(`${API_URL}/signup`)
      .send(MOCK_USER)
      .expect('Content-Type', /json/)
      .expect(201);

    const { body: { message } } = await supertest(app)
      .post(`${API_URL}/login`)
      .send({ ...MOCK_USER, password: 'Asdf4312' })
      .expect('Content-Type', /json/)
      .expect(401);

    expect(message).toEqual(MOCK_MESSAGE);
  });
})
