import { createTestClient } from 'apollo-server-testing';
import Server from '../server.js';

import { QUERY_PROFILE } from './utils/gql.js';
import { loginUser } from './utils/helpers';
import ServerContext from '../context';
import { ApolloServer } from 'apollo-server';

let query;
let mutate;
let contextMock;

describe('users', () => {
  beforeEach(async () => {
    contextMock = {};
    const server = await Server(ApolloServer, { context: () => contextMock });
    const testClient = createTestClient(server);
    ({ query, mutate } = testClient);
  });

  it('a not authenticated user can not query there user profile', async () => {
    const { errors } = await query({ query: QUERY_PROFILE });

    expect(errors[0].message).toContain('Not Authorised!');
  });

  it('an authenticated user can query there user profile', async () => {
    let token = await loginUser(
      mutate,
      process.env.TEST_USER_EMAIL,
      process.env.TEST_USER_PASSWORD
    );

    // decode user and attach token to header
    contextMock = ServerContext({
      req: {
        headers: { authorization: token },
      },
    });

    const {
      data: { profile },
    } = await query({ query: QUERY_PROFILE });

    expect(profile).toHaveProperty('name', process.env.TEST_USER_NAME);
  });
});
