import { createTestClient } from 'apollo-server-testing';
import Server from '../server.js';
import { InMemoryDataSource, Post, User } from '../db.js';
import {
  QUERY_POSTS,
  MUTATION_WRITE_POST,
  MUTATION_UPVOTE_POST,
  MUTATION_DOWNVOTE_POST,
  MUTATION_DELETE_POST,
} from './utils/gql.js';
import { loginUser } from './utils/helpers';

describe('posts', () => {
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

    reqMock = { headers: {} }
    resMock = {}
  });

  const context = () => ({ req: reqMock, res: resMock})
  const server = new Server({
    dataSources: () => ({ db }),
    context,
  });

  const { mutate, query } = createTestClient(server);

  describe('query posts', () => {
    it('returns an empty post array', async () => {
      await expect(query({ query: QUERY_POSTS })).resolves.toMatchObject({
        errors: undefined,
        data: { posts: [] },
      });
    });

    it('given some posts in the database and return it', async () => {
      // create a post
      db.posts = [
        new Post({
          title: 'Some post',
          authorid: db.users[0].id,
          votes: 0,
        }),
      ];

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
    });
  });

  describe('write posts', () => {
    it('can not create a post, if the user is not authenticated', async () => {
      reqMock = { headers: { authorization: null } };

      const { errors } = await mutate({
        mutation: MUTATION_WRITE_POST,
        variables: {
          post: { title: 'a test post' },
        },
      });

      expect(errors[0].message).toContain('Not Authorised!');
    });

    it.only('an authenticated user can write a new post', async () => {
      const token = await loginUser(mutate);
      console.log('##### token', token);


      reqMock = { headers: { authorization: token } };

      console.log('### reqMock', reqMock);

      const writePostMutation = mutate({
        mutation: MUTATION_WRITE_POST,
        variables: {
          post: { title: 'a test post' },
        },
      });

      await expect(writePostMutation).resolves.toMatchObject({
        errors: undefined,
        data: {
          write: {
            title: 'a test post',
            id: expect.any(String),
            author: { name: 'Sarah M.' },
          },
        },
      });
    });

    it('the post ist added to db.posts', async () => {
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
    });

    it('write post responds with propper mutation', async () => {
      const token = await loginUser(mutate);

      reqMock = { headers: { authorization: token } };

      const { data } = await mutate({
        mutation: MUTATION_WRITE_POST,
        variables: {
          post: { title: 'a test post' },
        },
      });

      expect(data).toHaveProperty('write');
    });
  });

  describe('upvote posts', () => {
    it('upvote a post can not be called by not an authenticated user', async () => {
      reqMock = { headers: { authorization: null } };

      const { errors } = await mutate({
        mutation: MUTATION_UPVOTE_POST,
        variables: {
          id: 1234,
        },
      });

      expect(errors[0].message).toContain('Not Authorised!');
    });

    it('upvote a post can only be called by an authenticated user', async () => {
      const token = await loginUser(mutate);

      reqMock = { headers: { authorization: token } };

      // create post
      db.posts = [new Post({ title: 'a test post', authorid: db.users[0].id })]

      // query posts
      const {data:{posts}} = await query({ query: QUERY_POSTS });

      const { data } = await mutate({
        mutation: MUTATION_UPVOTE_POST,
        variables: {
          id: posts[0].id,
        },
      });

      expect(data.upvote).toHaveProperty('votes', 1);
    });

    it('throws an error, when the post id is invalid', async () => {
      const token = await loginUser(mutate);

      reqMock = { headers: { authorization: token } };

      const { errors } = await mutate({
        mutation: MUTATION_UPVOTE_POST,
        variables: {
          id: 1234,
        },
      });

      expect(errors[0].message).toContain('Invalid post');
    });

    it('a logged in user can not upvote the same post multiple times', async () => {
      const token = await loginUser(mutate);

      reqMock = { headers: { authorization: token } };

      // create post
      db.posts = [new Post({ title: 'a test post', authorid: db.users[0].id })]

      // query posts
      const {data:{posts}} = await query({ query: QUERY_POSTS });
      const postId = posts[0].id;

      // first upvote
      await mutate({
        mutation: MUTATION_UPVOTE_POST,
        variables: {
          id: postId,
        },
      });

      // second upvote
      const { data } = await mutate({
        mutation: MUTATION_UPVOTE_POST,
        variables: {
          id: postId,
        },
      });

      expect(data.upvote).toHaveProperty('votes', 1);
    });

    it('upvote post is called', async () => {
      const token = await loginUser(mutate);

      reqMock = { headers: { authorization: token } };

      // mock function
      db.upvotePost = jest.fn(() => {});

      // seed posts
      db.posts = [new Post({ title: 'a test post', authorid: db.users[0].id })]

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
  });

  describe('downvote posts', () => {
    it('downvote a post can not be called by not an authenticated user', async () => {
      reqMock = { headers: { authorization: null } };

      const { errors } = await mutate({
        mutation: MUTATION_DOWNVOTE_POST,
        variables: {
          id: 1234,
        },
      });

      expect(errors[0].message).toContain('Not Authorised!');
    });

    it('downvote a post can only be called by an authenticated user', async () => {
      const token = await loginUser(mutate);

      reqMock = { headers: { authorization: token } };

      // seed posts
      db.posts = [new Post({ title: 'a test post', authorid: db.users[0].id })]

      // query posts
      const {data:{posts}} = await query({ query: QUERY_POSTS });

      const postId = posts[0].id;

      const { errors } = await mutate({
        mutation: MUTATION_DOWNVOTE_POST,
        variables: {
          id: postId,
        },
      });

      expect(errors).not.toBeDefined();
    });

    it('throws an error, when the post id is invalid', async () => {
      const token = await loginUser(mutate);

      reqMock = { headers: { authorization: token } };

      const { errors } = await mutate({
        mutation: MUTATION_DOWNVOTE_POST,
        variables: {
          id: 1234,
        },
      });

      expect(errors[0].message).toContain('Invalid post');
    });

    it('a post can be up and downvoted', async () => {
      const token = await loginUser(mutate);

      reqMock = { headers: { authorization: token } };

      // seed posts
      db.posts = [new Post({ title: 'a test post', authorid: db.users[0].id })]

      // query posts
      const {data:{posts}} = await query({ query: QUERY_POSTS });

      const postId = posts[0].id;

      await mutate({
        mutation: MUTATION_UPVOTE_POST,
        variables: {
          id: postId,
        },
      });

      const { data } = await mutate({
        mutation: MUTATION_DOWNVOTE_POST,
        variables: {
          id: postId,
        },
      });

      expect(data.downvote).toHaveProperty('votes', 0);
    });

    // todo: a post can have a negativ vote count
  });

  describe('delete post', () => {
    it('a post can not be deleted by not an authenticated user', async () => {
      reqMock = { headers: { authorization: null } };

      const { errors } = await mutate({
        mutation: MUTATION_DELETE_POST,
        variables: {
          id: 1234,
        },
      });

      expect(errors[0].message).toContain('Not Authorised!');
    });

    it("an authenticaed user can not delete other users' posts", async () => {
      const token = await loginUser(mutate);

      reqMock = { headers: { authorization: token } };

      // seed posts
      db.posts = [new Post({ title: 'a test post', authorid: db.users[0].id })]

      // query posts
      const {data:{posts}} = await query({ query: QUERY_POSTS });

      const postId = posts[0].id;

      const { errors } = await mutate({
        mutation: MUTATION_DELETE_POST,
        variables: {
          id: postId,
        },
      });

      expect(errors[0].message).toContain('Not Authorised!');
    });

    it('an authenticaed user can delete their own posts', async () => {
      const token = await loginUser(mutate);

      reqMock = { headers: { authorization: token } };

      // create posts
      db.posts = [
        new Post({ title: 'a test post', authorid: db.users[0].id }),
        new Post({ title: 'an awesome post', authorid: db.users[1].id }),
      ]

      // query posts
      const {data:{posts}} = await query({ query: QUERY_POSTS });

      const postId = posts[1].id;

      const { data } = await mutate({
        mutation: MUTATION_DELETE_POST,
        variables: {
          id: postId,
        },
      });

      expect(data).toHaveProperty('delete');
    });
  });
});
