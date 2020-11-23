import { createTestClient } from 'apollo-server-testing'
import { gql } from ' apollo-server'
import Server from './server.js'
import { InMemoryDataSource, User, Post } from './ds.js'

let ds
beforeEach(() => {
    ds = new InMemoryDataSource(),  //muss hier ein Komma?
    ds.users.push(new User('Jenny V.'))
})

const server = new Server({ dataSources: () => ({ ds }) })

const { query, mutate } = createTestClient(server)

describe('queries', () => {
  describe('POSTS', () =>
    const POSTS = gql`
      query {
        posts {
          id
          title
        }
      }

    it('returns empty array', async () => {
      await expect(query({ query : POSTS }))
        .resolves
        .toMatchObject({
            errors: undefined,
            data: { posts: [] }
        })
    })

    describe('given posts in database', () => {
      beforeEach(() => {
        ds.posts = [new Post({ title: 'Some post', authorName: 'Jenny V.' })];
      })

      it('returns posts', async () => {
        await expect(query({ query: POSTS }))
          .resolves
          .toMatchObject({
              errors: undefined,
              data: {
                posts: [{ id: expect.any(String), title: 'Some post', votes: 0, author: { name: "Jenny V." } }],
              }
          })
      })
    })
  })
})

describe('mutations', () => {
    describe('WRITE_POST', () => {
        const WRITE_POST = gql`
            mutation($post: PostInput!) {
                write(post: $post) {
                    id
                    title
                    votes
                    author {
                        name
                    }
                }
            }
        `
        const action = () =>
            mutate({ mutation: WRITE_POST, variables: { post: { title: 'Some post', author: { name: 'Jenny V.' } } } })
        const invalidUser = () =>
            mutate({ mutation: WRITE_POST, variables: { post: { title: 'Some post', author: { name: 'INVALID' } } } })

        it('throws error when user is invalid', async () => {
            const {
                errors: [error]
            } = await invalidUser()
            expect(error.message).toEqual('Invalid user')
        })

        it('adds a post to ds.posts', async () => {
            expect(ds.posts).toHaveLength(0)
            await action()
            expect(ds.posts).toHaveLength(1)
        })

        it('calls ds.createPost', async () => {
            ds.createPost = jest.fn(() => {})
            await action()
            expect(ds.createPost).toHaveBeenCalledWith({ title: 'Some post', authorName: 'Jenny V.' })
        })

        it("responds with created post", async () => {
            await expect(action()).resolves.toMatchObject({
                errors: undefined,
                data: { write: { title: 'Some post', id: expect.any(String), votes: 0, author: { name: 'Jenny V.' } } },
            })
        })
    })
    describe("VOTE_POST", () => {
        let postId,
        beforeEach(() => {
            ds.posts = [new Post({ title: 'Some post', authorName: 'Jenny V.' })]
            postId = ds.posts[0].id
        })
        describe('UPVOTE_POST', () => {
            const UPVOTE_POST = gql`
                mutation($id: ID!, $voter: UserInput!) {
                    upvote(id: $id, voter: $voter) {
                        title
                        id
                        author {
                            name
                        }
                        votes
                    }
                }
            `
            const upvote = () => {
                mutate({
                    mutation: UPVOTE_POST,
                    variables: { id: postId, voter: { name: 'Jenny V.'} }
                })
            }

            it('calls ds.upvotePost', async () => {
                ds.upvotePost = jest.fn((id, userInput) => {
                    console.log(id)
                    console.log(userInput)
                })
                await upvote()
                expect(ds.upvotePost).toHaveBeenCalledWith(postId, 'Jenny V.')
            })

            it('throws error when post id invalid', async () => {
                const invalidId = () => {
                    mutate({ mutation: UPVOTE_POST, variables: { id: 123, voter: { name: 'Jenny V.' } } })
                }
                const {
                    errors: [error]
                } = await invalidId()
                expect(error.message).toEqual('Invalid post')
            })

            it('throws error when user is invalid', async () => {
                const invalidUser = () => {
                    mutate({
                        mutation: UPVOTE_POST,
                        variables: { id: postId, voter: { name: 'INVALID' } }
                    })
                }
                const {
                    errors: [error]
                } = await invalidUser()
                expect(error.message).toEqual('Invalid user')
            })

            it('upvotes post', async () => {
                await expect(upvote())
                  .resolves
                  .toMatchObject({
                    errors: undefined,
                    data: {
                        upvote: { title: 'Some post', id: expect.any(String), votes: 1, author: { name: 'Jenny V.' } }
                    }
                  })
            })
        })
    })
})
