// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// the data
import { gql } from 'apollo-server'

const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    votes: Int!
    author: User! 
  }

  type User {
    name: ID!
    posts: [Post]
  }

  type Query {
    posts: [Post]
    users: [User]
  }

  type Mutation {
    write(post: PostInput!): Post
    upvote(id: ID!, voter: UserInput!): Post
  }

  input PostInput {
    title: String!

    # ⚠️ FIXME in exercise #4
    # mock author until we have authentication
    author: UserInput!
  }

  input UserInput {
    name: String!
  }

`;

export default typeDefs;
