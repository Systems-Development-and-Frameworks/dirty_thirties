import { createTestClient } from 'apollo-server-testing';
import Server from '../server.js';
import { ApolloServer } from 'apollo-server';
import ServerContext from '../context';

import {
  MUTATION_LOGIN,
  MUTATION_REGISTER,
  MUTATION_DELETE_ACCOUNT,
} from './utils/gql';

//jest.mock('./../graphCms/schema');

let query;
let mutate;
let contextMock = {};

describe('auth', () => {
  let db;

  beforeEach(async () => {
    contextMock = {};
    const server = await Server(ApolloServer, { context: () => contextMock });
    const testClient = createTestClient(server);
    // eslint-disable-next-line no-unused-vars
    ({ query, mutate } = testClient);
  });

  describe('login', () => {
    it('can login a user', async () => {
      const {
        data: { login },
      } = await mutate({
        mutation: MUTATION_LOGIN,
        variables: {
          email: process.env.TEST_USER_EMAIL,
          password: process.env.TEST_USER_PASSWORD,
        },
      });

      expect(login).toContain('Bearer');
    });

    it("can't login a user if they do not exist (404)", async () => {
      const { errors } = await mutate({
        mutation: MUTATION_LOGIN,
        variables: {
          email: 'not_exist@example.com',
          password: 'password',
        },
      });

      expect(errors[0].message).toContain('User not found');
    });
  });

  describe('register', () => {
    it('can register a new user', async () => {
      const email = `test_${Date.now()}@example.com`;
      console.log('email', email);

      const {
        data: { signup },
      } = await mutate({
        mutation: MUTATION_REGISTER,
        variables: {
          name: 'test',
          email,
          password: 'password',
        },
      });

      expect(signup).toContain('Bearer');

      // clanup
      contextMock = ServerContext({
        req: {
          headers: { authorization: signup },
        },
      });

      const deleteResponse = await mutate({
        mutation: MUTATION_DELETE_ACCOUNT,
        variables: {
          email,
        },
      });

      console.log(deleteResponse);
      expect(deleteResponse.errors).toBeUndefined();
    });

    it('can not register a user if the email is already taken', async () => {
      const { errors } = await mutate({
        mutation: MUTATION_REGISTER,
        variables: {
          name: process.env.TEST_USER_NAME,
          email: process.env.TEST_USER_EMAIL,
          password: process.env.TEST_USER_PASSWORD,
        },
      });

      expect(errors[0].message).toContain('Email already exists.');
    });

    // skip for now. users are persisted to the graphcms
    // we do neet the test the functionallity of the application
    // we could test this if we create and login as the same user
    // to assume that the user was persited in the graphcms
    it.skip('a new user is added to users db', async () => {
      db.users = [];

      expect(db.users).toHaveLength(0);

      await mutate({
        mutation: MUTATION_REGISTER,
        variables: {
          name: 'test',
          email: 'test@example.com',
          password: 'password',
        },
      });

      expect(db.users).toHaveLength(1);
    });

    it('throws an error, if the password is less than 8 characters', async () => {
      const { errors } = await mutate({
        mutation: MUTATION_REGISTER,
        variables: {
          name: 'test',
          email: 'test@example.com',
          password: 'a'.repeat(7),
        },
      });

      expect(errors[0].message).toContain('[Validation Errors]');
    });
  });
});
