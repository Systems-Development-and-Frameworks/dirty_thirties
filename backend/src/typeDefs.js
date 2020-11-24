// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// the data
import { gql } from 'apollo-server';

const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    votes: Int!
    author: User
  }

  type User {
    id: ID!
    name: String!
    posts: [Post]
  }

  type Query {
    posts: [Post]
    users: [User]
  }

  type Mutation {
    createPost(title: String!, userId: ID!): Post
    upvotePost(id: ID!, userId: ID!): Post
    downvotePost(id: ID!, userId: ID!): Post
    deletePost(id: ID!, userId: ID!): Post
  }

  input PostInput {
    title: String!

    # ⚠️ FIXME in exercise #4
    # mock author until we have authentication
    # author: UserInput!
  }

  
`;

export default typeDefs;
