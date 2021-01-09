import { gql } from 'apollo-server';

export default gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post]
  }

  type Query {
    profile: Person
  }

  type Mutation {
    write(post: PostInput!): Post
    upvote(post: PostInput!): Vote
    # 🚀 OPTIONAL
    downvote(post: PostInput!): Vote
    # 🚀 OPTIONAL
    delete(post: PostInput!): Post

    # """
    # returns a signed JWT or null
    # """
    login(email: String!, password: String!): String

    # """
    # returns a signed JWT or null // Register
    # """
    signup(name: String!, email: String!, password: String!): String

    # """
    # delete user account
    # """
    deleteAccount(email: String!): String
  }

  input PostInput {
    id: ID
    title: String
  }

  extend type Person {
    postCount: Int
  }

  extend type Post {
    votesCount: Int
  }
`;
