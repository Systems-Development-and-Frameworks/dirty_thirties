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
    email: String!
    posts: [Post]
  }
  type Query {
    posts: [Post]
    users: [User]
  }
  type Mutation {
    # old  methods
    createPost(title: String!, userId: ID!): Post
    upvotePost(id: ID!, userId: ID!): Post
    downvotePost(id: ID!, userId: ID!): Post
    deletePost(id: ID!, userId: ID!): Post
    # new
    write(post: PostInput!): Post
    # upvote(id: ID!): Post
    # 🚀 OPTIONAL
    # downvote(id: ID!): Post
    # 🚀 OPTIONAL
    # delete(id: ID!): Post
    # """
    # returns a signed JWT or null
    # """
    login(email: String!, password: String!): String
    # """
    # returns a signed JWT or null // Register
    # """
    signup(name: String!, email: String!, password: String!): String
  }
  input PostInput {
    title: String!
  }
`;

export default typeDefs;
