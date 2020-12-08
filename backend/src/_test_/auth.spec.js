import { createTestClient } from 'apollo-server-testing';
import Server from '../server.js';
import { InMemoryDataSource, User } from '../db.js';
import { MUTATION_LOGIN, MUTATION_REGISTER } from './utils/gql';

describe('auth', () => {
  let db;

  beforeEach(() => {
    db = new InMemoryDataSource();
    db.users = [
        new User('Jenny V.', 'jenny@example.com', 'password'),
        new User('Sarah M.', 'sarah@example.com', 'password'),
        new User('Nele H.', 'nele@example.com', 'password'),
      ];
  });

  const server = new Server({ dataSources: () => ({ db }) });

  const { mutate } = createTestClient(server);

  describe('login', () => {
    it('can login a user', async () => {
      const {
        data: { login },
      } = await mutate({
        mutation: MUTATION_LOGIN,
        variables: { email: 'sarah@example.com', password: 'password' },
      });

      expect(login).toContain('Bearer');
    });

    it("can't login a user if they do not exist (404)", async () => {
      const { errors } = await mutate({
        mutation: MUTATION_LOGIN,
        variables: { email: 'not_exist@example.com', password: 'password' },
      });

      expect(errors[0].message).toContain('404');
    });
  });

  describe('register', () => {
    it('can register a new user', async () => {
      const {
        data: { signup },
      } = await mutate({
        mutation: MUTATION_REGISTER,
        variables: {
          name: 'test',
          email: 'test@example.com',
          password: 'password',
        },
      });

      expect(signup).toContain('Bearer');
    });

    it('can register a user if the email is already taken (409)', async () => {
      const { errors } = await mutate({
        mutation: MUTATION_REGISTER,
        variables: {
          name: 'Sarah Test',
          email: 'sarah@example.com',
          password: 'password',
        },
      });

      expect(errors[0].message).toContain('409');
    });

    it('a new user is added to users db', async () => {
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

      expect(errors[0].message).toContain('400');
      expect(errors[0].extensions.invalidArgs).toContain('[Validation Errors]');
    });
  });
});
