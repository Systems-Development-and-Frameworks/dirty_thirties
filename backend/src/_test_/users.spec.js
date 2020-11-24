import { gql } from 'apollo-server';
import { createTestClient } from 'apollo-server-testing';
import Server from '../server.js';
import { InMemoryDataSource, User, Post } from '../db.js';

let TEST_USER_ID_0;
// let TEST_USER_ID_1;
let db;
beforeEach(() => {
  db = new InMemoryDataSource();
  db.users.push(new User('Jenny V.'), new User('Sarah M.'));

  TEST_USER_ID_0 = db.users[0].id;
 // TEST_USER_ID_1 = db.users[1].id;
});

const server = new Server({ dataSources: () => ({ db }) });

const { query, mutate } = createTestClient(server);

describe('queries', () => {
  describe('USERS', () => {
    const USERS = gql`
      query {
        users {
          name
        }
      }
    `;

    // pass
    it('given users in the database', async () => {
      await expect(query({ query: USERS })).resolves.toMatchObject({
        errors: undefined,
        data: { users: [{ name: 'Jenny V.' }, { name: 'Sarah M.' }] },
      });
    });
  });

  describe('USERS', () => {
    const USERS = gql`
      query {
        users {
          name
          posts {
            title
          }
        }
      }
    `;

    // pass
    it('returns all users with no posts', async () => {
      await expect(query({ query: USERS })).resolves.toMatchObject({
        errors: undefined,
        data: {
          users: [
            { name: 'Jenny V.', posts: [] },
            { name: 'Sarah M.', posts: [] },
          ],
        },
      });
    });

    describe('WRITE_POST', () => {
      const action = () =>
        mutate({
          mutation: WRITE_POST,
          variables: {
            postTitle: 'Some post',
            userId: TEST_USER_ID_0,
          },
        });

      const WRITE_POST = gql`
        mutation($postTitle: String!, $userId: ID!) {
          createPost(title: $postTitle, userId: $userId) {
            author {
              name
              posts {
                title
              }
            }
          }
        }
      `;

      // pass
      it('adds post to user', async () => {
        await expect(action()).resolves.toMatchObject({
          errors: undefined,
          data: {
            createPost: {
              author: { name: 'Jenny V.', posts: [{ title: 'Some post' }] },
            },
          },
        });
      });
    });

    describe('DELETE_POST', () => {
      let DELETE_POST_ID;

      beforeEach(() => {
        db.posts = [new Post({ title: 'Some post', userId: TEST_USER_ID_0 })];

        DELETE_POST_ID = db.posts[0].id;
      });

      const DELETE_POST = gql`
        mutation($id: ID!, $userId: ID!) {
          deletePost(id: $id, userId: $userId) {
            author {
              name
              posts {
                title
              }
            }
          }
        }
      `;

      const deletePost = () =>
        mutate({
          mutation: DELETE_POST,
          variables: { id: DELETE_POST_ID, userId: TEST_USER_ID_0 },
        });

      // TODO Fix test
      it.skip('removes post from a user', async () => {
        console.log('DELETE_POST_ID', DELETE_POST_ID);
        console.log(db.posts, db.users);
        await expect(deletePost()).resolves.toMatchObject({
          errors: undefined,
          data: {
            deletePost: { author: { name: 'Jenny V.', posts: [] } },
          },
        });
      });
    });
  });
});