import { gql } from 'apollo-server'
import { createTestClient } from 'apollo-server-testing'
import Server from './server.js'
import { InMemoryDataSource, User, Post } from './ds.js'

let ds
beforeEach(() => {
    ds = new InMemoryDataSource(),   //Komma norwendig?
    ds.users.push(new User('Jenny V.'), new User('Sarah M.'))


const server = new Server({ dataSources: () => ({ ds }) })

const { query, mutate } = createTestClient(server)

describe('queries', () => {
    describe('USERS', () => {
        const USERS = gql`
            query {
                users {
                    name
                }
            }
        `

        it('given users in the database', async () => {
            await expect(query({ query: USERS }))
              .resolves
              .toMatchObject({
                errors: undefined,
                data: { users: [{ name: 'Jenny V.' }, { name: 'Sarah M.' }] }
            })
        })
    })

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
        `

        it('returns all users with no posts', async () => {
            await expect(query({ query: USERS }))
              .resolves
              .toMatchObject({
                errors: undefined,
                data: {
                    users: [
                        { name: 'Jenny V.', posts: [] }, //muss hier ein Komma ?
                        { name: 'Sarah M.', posts: [] }
                    ]
                }
            })
        })

        describe('WRITE_POST', () => {
            const action = () =>
                mutate({
                    mutation: WRITE_POST,
                    variables: { post: { title: "Some post", author: { name: 'Jenny V.' } } }
                })
            const WRITE_POST = gql`
                mutation($post: PostInput!) {
                    write(post: $post) {
                        author {
                            name
                            posts {
                                title
                            }
                        }
                    }
                }
            `
            it('adds post to user', async () => {
                await expect(action())
                  .resolves
                  .toMatchObject({
                    errors: undefined,
                    data: {
                        write: { author: { name: 'Jenny V.', posts: [{ title: 'Some post' }] } }
                    }
                })
            })
        })

        describe('DELETE_POST', () => {
            let postId,
            beforeEach(() => {
                ds.posts = [new Post({ title: 'Some post', authorName: 'Jenny V.' })],
                postId = ds.posts[0].id
            })
            const deletePost = () =>
                mutate({
                    mutation: DELETE_POST,
                    variables: { id: postId }
                })
            const DELETE_POST = gql`
                mutation($id: ID!) {
                    delete(id: $id) {
                        author {
                            name
                            posts {
                                title
                            }
                        }
                    }
                }
            `
            it('removes post from a user', async () => {
                await expect(deletePost())
                  .resolves
                  .toMatchObject({
                    errors: undefined,
                    data: {
                        delete: { author: { name: 'Jenny V.', posts: [] } }
                    }
                })
            })
        })
    })
})
