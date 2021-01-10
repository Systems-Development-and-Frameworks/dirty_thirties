import { createTestClient } from 'apollo-server-testing';
import Server from '../server.js';
import { ApolloServer } from 'apollo-server';
import ServerContext from '../context';

import {
  QUERY_POSTS,
  MUTATION_WRITE_POST,
  MUTATION_UPVOTE_POST,
  MUTATION_DOWNVOTE_POST,
  MUTATION_DELETE_POST,
} from './utils/gql.js';
import { loginUser } from './utils/helpers';

//jest.mock('./../graphCms/schema');

let query;
let mutate;
let contextMock;

describe('posts', () => {
  beforeEach(async () => {
    contextMock = {};
    const server = await Server(ApolloServer, { context: () => contextMock });
    const testClient = createTestClient(server);
    ({ query, mutate } = testClient);
  });

  describe('query posts', () => {
    it('returns an empty post array', async () => {
      await expect(query({ query: QUERY_POSTS })).resolves.toMatchObject({
        errors: undefined,
        data: { posts: [] },
      });
    });

    it('given some posts in the database and return it', async () => {
      // login user
      const token = await loginUser(
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
      // create a post

      const {
        data: { write },
      } = await mutate({
        mutation: MUTATION_WRITE_POST,
        variables: {
          post: { title: 'Some post' },
        },
      });

      console.log(write)
      await expect(query({ query: QUERY_POSTS })).resolves.toMatchObject({
        errors: undefined,
        data: {
          posts: [
            {
              id: expect.any(String),
              title: 'Some post',
            },
          ],
        },
      });

      // Cleanup
      const deleteResponse = await mutate({
        mutation: MUTATION_DELETE_POST,
        variables: {
          post: {
            id: write.id,
          },
        },
      });

      expect(deleteResponse.data.delete.title).toContain('Some post');
    });
  });

  describe('write posts', () => {
    it('can not create a post, if the user is not authenticated', async () => {
      const { errors } = await mutate({
        mutation: MUTATION_WRITE_POST,
        variables: {
          post: { title: 'a test post' },
        },
      });

      expect(errors[0].message).toContain('Not Authorised!');
    });

    it('an authenticated user can write a new post', async () => {
      // login user
      const token = await loginUser(
        mutate,
        process.env.TEST_USER_EMAIL,
        process.env.TEST_USER_PASSWORD
      );

      // decode user and attach token to header
      const obj = {
        req: {
          headers: { authorization: token },
        },
      };

      contextMock = ServerContext(obj);
      // create a post

      const { data } = await mutate({
        mutation: MUTATION_WRITE_POST,
        variables: {
          post: { title: 'a test post' },
        },
      });

      expect(data).toMatchObject({
        write: {
          title: 'a test post',
          id: expect.any(String),
          author: { name: process.env.TEST_USER_NAME },
        },
      });

      // Cleanup
      const {
        data: {
          delete: { title },
        },
      } = await mutate({
        mutation: MUTATION_DELETE_POST,
        variables: {
          post: {
            id: data.write.id,
          },
        },
      });

      expect(title).toContain('a test post');
    });

    // skip for now: See explanation in the auth test
/*     it.skip('the post ist added to db.posts', async () => {
      const token = await loginUser(mutate);

      reqMock = { headers: { authorization: token } };

      expect(db.posts).toHaveLength(0);

      await mutate({
        mutation: MUTATION_WRITE_POST,
        variables: {
          post: { title: 'a test post' },
        },
      });

      expect(db.posts).toHaveLength(1);
    }); */

    it('write post responds with propper mutation', async () => {
      // login user
      const token = await loginUser(
        mutate,
        process.env.TEST_USER_EMAIL,
        process.env.TEST_USER_PASSWORD
      );

      // decode user and attach token to header
      const obj = {
        req: {
          headers: { authorization: token },
        },
      };

      contextMock = ServerContext(obj);
      // create a post

      const { data } = await mutate({
        mutation: MUTATION_WRITE_POST,
        variables: {
          post: { title: 'Some post' },
        },
      });

      expect(data).toHaveProperty('write');

      // cleanup
      await mutate({
        mutation: MUTATION_DELETE_POST,
        variables: {
          post: {
            id: data.write.id,
          },
        },
      });
    });
  });

  describe('upvote posts', () => {
    it('upvote a post can not be called by not an authenticated user', async () => {
      const { errors } = await mutate({
        mutation: MUTATION_UPVOTE_POST,
        variables: {
          post: {
            id: 1234,
          },
        },
      });

      expect(errors[0].message).toContain('Not Authorised!');
    });

    it('upvote a post can only be called by an authenticated user', async () => {
      // login user
      const token = await loginUser(
        mutate,
        process.env.TEST_USER_EMAIL,
        process.env.TEST_USER_PASSWORD
      );

      // decode user and attach token to header
      const obj = {
        req: {
          headers: { authorization: token },
        },
      };

      contextMock = ServerContext(obj);
      // create a post
      const {
        data: { write },
      } = await mutate({
        mutation: MUTATION_WRITE_POST,
        variables: {
          post: { title: 'Some post' },
        },
      });

      // upvoting
      const { data } = await mutate({
        mutation: MUTATION_UPVOTE_POST,
        variables: {
          post: { id: write.id },
        },
      });

      expect(data.upvote).toHaveProperty('value', 1);

      // cleanup
      await mutate({
        mutation: MUTATION_DELETE_POST,
        variables: {
          post: {
            id: write.id,
          },
        },
      });
    });

    it('throws an error, when the post id is invalid', async () => {
      // login user
      const token = await loginUser(
        mutate,
        process.env.TEST_USER_EMAIL,
        process.env.TEST_USER_PASSWORD
      );

      // decode user and attach token to header
      const obj = {
        req: {
          headers: { authorization: token },
        },
      };

      contextMock = ServerContext(obj);

      const { errors } = await mutate({
        mutation: MUTATION_UPVOTE_POST,
        variables: {
          post: { id: 'abc' },
        },
      });

      // if the reference post does not exist
      expect(errors[0].message).toContain(
        'please make sure all referred documents exist'
      );
    });

    it('a logged in user can not upvote the same post multiple times', async () => {
      // login user
      const token = await loginUser(
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

      // create a post
      const {
        data: { write },
      } = await mutate({
        mutation: MUTATION_WRITE_POST,
        variables: {
          post: { title: 'Some post' },
        },
      });

      // first upvote
      await mutate({
        mutation: MUTATION_UPVOTE_POST,
        variables: {
          post: { id: write.id },
        },
      });

      // second upvote
      const { data } = await mutate({
        mutation: MUTATION_UPVOTE_POST,
        variables: {
          post: { id: write.id },
        },
      });

      // the mutations log: [upvote] user has upvoted, doing nothing...
      // and exit with null the function
      expect(data.upvote).toBeNull();

      // cleanup
      await mutate({
        mutation: MUTATION_DELETE_POST,
        variables: {
          post: {
            id: write.id,
          },
        },
      });
    });

    // skip for now: since we test on a live db
    // we assue that the nessesary methods
    // are called
    /* it.skip('upvote post is called', async () => {
      const token = await loginUser(mutate);

      reqMock = { headers: { authorization: token } };

      // mock function
      db.upvotePost = jest.fn(() => {});

      // seed posts
      db.posts = [new Post({ title: 'a test post', authorid: db.users[0].id })];

      // query posts
      const postData = await query({ query: QUERY_POSTS });

      await mutate({
        mutation: MUTATION_UPVOTE_POST,
        variables: {
          id: postData.data.posts[0].id,
        },
      });

      expect(db.upvotePost).toHaveBeenCalledTimes(1);
    });
  }); */

  describe('downvote posts', () => {
    it('downvote a post can not be called by not an authenticated user', async () => {
      const { errors } = await mutate({
        mutation: MUTATION_DOWNVOTE_POST,
        variables: {
          post: {
            id: 1234,
          },
        },
      });

      expect(errors[0].message).toContain('Not Authorised!');
    });

    it('downvote a post can only be called by an authenticated user', async () => {
      // login user
      const token = await loginUser(
        mutate,
        process.env.TEST_USER_EMAIL,
        process.env.TEST_USER_PASSWORD
      );

      // decode user and attach token to header
      const obj = {
        req: {
          headers: { authorization: token },
        },
      };

      contextMock = ServerContext(obj);
      // create a post
      const {
        data: { write },
      } = await mutate({
        mutation: MUTATION_WRITE_POST,
        variables: {
          post: { title: 'Some post' },
        },
      });

      // Downvoting
      const { data } = await mutate({
        mutation: MUTATION_DOWNVOTE_POST,
        variables: {
          post: { id: write.id },
        },
      });

      expect(data.downvote).toHaveProperty('value', -1);

      // cleanup
      await mutate({
        mutation: MUTATION_DELETE_POST,
        variables: {
          post: {
            id: write.id,
          },
        },
      });
    });

    it('throws an error, when the post id is invalid', async () => {
      // login user
      const token = await loginUser(
        mutate,
        process.env.TEST_USER_EMAIL,
        process.env.TEST_USER_PASSWORD
      );

      // decode user and attach token to header
      const obj = {
        req: {
          headers: { authorization: token },
        },
      };

      contextMock = ServerContext(obj);

      const { errors } = await mutate({
        mutation: MUTATION_DOWNVOTE_POST,
        variables: {
          post: { id: 'abc' },
        },
      });

      // if the reference post does not exist
      expect(errors[0].message).toContain(
        'please make sure all referred documents exist'
      );
    });

    it('a post can be up and downvoted', async () => {
      // login user
      const token = await loginUser(
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
      // create a post
      const {
        data: { write },
      } = await mutate({
        mutation: MUTATION_WRITE_POST,
        variables: {
          post: { title: 'Some post' },
        },
      });

      // upvote
      await mutate({
        mutation: MUTATION_UPVOTE_POST,
        variables: {
          post: { id: write.id },
        },
      });

      // Downvoting
      const { data } = await mutate({
        mutation: MUTATION_DOWNVOTE_POST,
        variables: {
          post: { id: write.id },
        },
      });

      expect(data.downvote).toHaveProperty('value', -1);

      // cleanup
      await mutate({
        mutation: MUTATION_DELETE_POST,
        variables: {
          post: {
            id: write.id,
          },
        },
      });
    });

    // todo: a post can have a negativ vote count
  });

  describe('delete post', () => {
    it('a post can not be deleted by not an authenticated user', async () => {
      const { errors } = await mutate({
        mutation: MUTATION_DELETE_POST,
        variables: {
          post: {
            id: 'someid',
          },
        },
      });

      expect(errors[0].message).toContain('Not Authorised!');
    });

    it("an authenticaed user can not delete other users' posts", async () => {
      // login user 1
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

      // create a post by user 1
      const {
        data: { write },
      } = await mutate({
        mutation: MUTATION_WRITE_POST,
        variables: {
          post: { title: 'Some post by user 1' },
        },
      });

      // login user 2
      token = await loginUser(
        mutate,
        'test_user_2@example.com',
        process.env.TEST_USER_PASSWORD
      );

      // decode user and attach token to header
      contextMock = ServerContext({
        req: {
          headers: { authorization: token },
        },
      });

      // try to delete post form user 1
      const { errors } = await mutate({
        mutation: MUTATION_DELETE_POST,
        variables: {
          post: {
            id: write.id,
          },
        },
      });

      expect(errors[0].message).toContain(
        'This is not your post or post does not exist'
      );

      // cleanup

      // login back as user 1
      token = await loginUser(
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

      await mutate({
        mutation: MUTATION_DELETE_POST,
        variables: {
          post: { id: write.id },
        },
      });
    });

    it('an authenticaed user can delete their own posts', async () => {
      // login user
      const token = await loginUser(
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
      // create a post
      const {
        data: { write },
      } = await mutate({
        mutation: MUTATION_WRITE_POST,
        variables: {
          post: { title: 'Some post' },
        },
      });

      // delte a post
      const { data } = await mutate({
        mutation: MUTATION_DELETE_POST,
        variables: {
          post: { id: write.id },
        },
      });

      expect(data).toHaveProperty('delete');
    });
  });
})})
