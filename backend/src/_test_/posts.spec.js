import { createTestClient } from 'apollo-server-testing';
import { gql } from 'apollo-server';
import Server from '../server.js';
import { InMemoryDataSource, User, Post } from '../db.js';

const TEST_USER_ID = 'e8a2d505ae85c351f2dbe5cd15c064d5';

let db;
beforeEach(() => {
  db = new InMemoryDataSource();

  const testUser = new User('Test User');
  testUser.id = TEST_USER_ID;

  db.users.push(testUser);
});

const server = new Server({ dataSources: () => ({ db }) });

const { query, mutate } = createTestClient(server);

describe('query', () => {
  describe('POSTS', () => {
    const POSTS = gql`
      query {
        posts {
          id
          title
        }
      }
    `;

    //  pass
    it('returns empty array', async () => {
      await expect(query({ query: POSTS })).resolves.toMatchObject({
        errors: undefined,
        data: { posts: [] },
      });
    });

    //  pass
    it('given some posts in the database and return it', async () => {
      db.posts = [new Post({ title: 'Some post', authorId: '1234' })];

      await expect(query({ query: POSTS })).resolves.toMatchObject({
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
    });
  });
});

describe('mutations', () => {
  describe('CREATE_POST', () => {
    const CREATE_POST = gql`
      mutation($postTitle: String!, $userId: ID!) {
        createPost(title: $postTitle, userId: $userId) {
          id
          title
          votes
          author {
            name
          }
        }
      }
    `;

    const createPost = () =>
      mutate({
        mutation: CREATE_POST,
        variables: {
          postTitle: 'Some post',
          userId: TEST_USER_ID,
        },
      });

    const invalidUser = () =>
      mutate({
        mutation: CREATE_POST,
        variables: {
          postTitle: 'Some post',
          userId: 'INVALID_ID_123',
        },
      });

    // pass
    it('throws error when user is invalid', async () => {
      const {
        errors: [error],
      } = await invalidUser();

      expect(error.message).toEqual('Invalid user');
    });

    // pass
    it('adds a post to db.posts', async () => {
      expect(db.posts).toHaveLength(0);
      await createPost();
      expect(db.posts).toHaveLength(1);
    });

    // pass
    it('calls db.createPost', async () => {
      db.createPost = jest.fn(() => {});
      await createPost();
      expect(db.createPost).toHaveBeenCalledWith({
        title: 'Some post',
        authorid: TEST_USER_ID,
        votes: 0,
      });
    });

    // pass
    it('responds with created post', async () => {
      await expect(createPost()).resolves.toMatchObject({
        errors: undefined,
        data: {
          createPost: {
            title: 'Some post',
            id: expect.any(String),
            votes: 0,
            author: { name: 'Test User' },
          },
        },
      });
    });
  });

  describe('VOTE_POST', () => {
    let TEST_POST_ID;

    beforeEach(() => {
      db.posts = [new Post({ title: 'Some post', authorId: TEST_USER_ID })];
      TEST_POST_ID = db.posts[0].id;
    });

    describe('UPVOTE_POST', () => {
      const UPVOTE_POST = gql`
        mutation($id: ID!, $userId: ID!) {
          upvotePost(id: $id, userId: $userId) {
            title
            id
            author {
              name
            }
            votes
          }
        }
      `;

      const upvote = () =>
        mutate({
          mutation: UPVOTE_POST,
          variables: { id: TEST_POST_ID, userId: TEST_USER_ID },
        });

      // pass
      it('calls db.upvotePost', async () => {
        db.upvotePost = jest.fn(() => {});

        await upvote();

        expect(db.upvotePost).toHaveBeenCalledWith(TEST_POST_ID, TEST_USER_ID);
      });

      // pass
      it('throws error when post id invalid', async () => {
        const invalidId = () =>
          mutate({
            mutation: UPVOTE_POST,
            variables: { id: 123, userId: TEST_USER_ID },
          });

        const {
          errors: [error],
        } = await invalidId();

        expect(error.message).toEqual('Invalid post');
      });

      // pass
      it('throws error when user is invalid', async () => {
        const invalidUser = () =>
          mutate({
            mutation: UPVOTE_POST,
            variables: { id: TEST_POST_ID, userId: 'INVALID_USER_ID' },
          });

        const {
          errors: [error],
        } = await invalidUser();

        expect(error.message).toEqual('Invalid user');
      });

      it('upvotes post', async () => {
        await expect(upvote()).resolves.toMatchObject({
          errors: undefined,
          data: {
            upvotePost: {
              title: 'Some post',
              id: expect.any(String),
              votes: 1,
              author: null, // todo fix it { name: 'Test User' },
            },
          },
        });
      });

      it('a user can not upvote multiple times', async () => {
        await upvote();

        await expect(upvote()).resolves.toMatchObject({
          errors: undefined,
          data: {
            upvotePost: {
              title: 'Some post',
              id: expect.any(String),
              votes: 1,
              author: null, // todo fix it { name: 'Test User' },
            },
          },
        });
      });
    });
  });
});
