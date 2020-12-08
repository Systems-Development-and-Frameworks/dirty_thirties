import { createTestClient } from 'apollo-server-testing';
import Server from '../server.js';
import { InMemoryDataSource, User } from '../db.js';

import { QUERY_USERS } from './utils/gql.js';
import { loginUser } from './utils/helpers';

describe('users', () => {
  let db;
  let resMock;
  let reqMock;

  beforeEach(() => {
    db = new InMemoryDataSource();
    db.users = [
      new User('Jenny V.', 'jenny@email.com', 'cheescake'), 
      new User('Sarah M.', 'sarah@email.com', 'marzipan'), 
      new User('Nele H.', 'nele@email.com', 'tiramisu')
    ];
  });

  const server = new Server({
    dataSources: () => ({ db }),
    context: () => ({
      req: reqMock,
      res: resMock,
    }),
  });

  const { mutate, query } = createTestClient(server);

  it('a not authenticated user can not see all users', async () => {
    reqMock = { headers: { authorization: null } };

    const { errors } = await query({ query: QUERY_USERS });

    expect(errors[0].message).toContain('Not Authorised!');
  });

  it('an authenticated user can query all users', async () => {
    const token = await loginUser(mutate);

    reqMock = { headers: { authorization: token } };
    const {
      data: {users},
    } = await query({ query: QUERY_USERS });
    expect(users).toHaveLength(3);
  });
});