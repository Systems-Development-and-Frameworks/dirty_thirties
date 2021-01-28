import { gql } from 'apollo-server';

// Queries
export const QUERY_USER_BY_EMAIL = gql`
  query($email: String!) {
    person(stage: DRAFT, where: { email: $email }) {
      id
    }
  }
`;

export const QUERY_USER_BY_EMAIL_W_PASSWORD = gql`
  query($email: String!) {
    person(stage: DRAFT, where: { email: $email }) {
      id
      password
    }
  }
`;

export const QUERY_PROFILE_BY_ID = gql`
  query($id: String!) {
    person(stage: DRAFT, where: { id: $id }) {
      id
      email
      name
    }
  }
`;

export const QUERY_POST = gql`
  query($id: String!) {
    post(stage: DRAFT, where: { id: $id }) {
      id
      title
      name
    }
  }
`;

export const QUERY_DOES_AUTHOR_HAS_POSTS = gql`
  query($userId: ID!, $postId: ID!) {
    posts(stage: DRAFT, where: { author: { id: $userId }, id: $postId }) {
      title
    }
  }
`;

export const QUERY_POST_VOTES = gql`
  query($userId: ID!, $postId: ID!) {
    votes(
      stage: DRAFT
      where: { post: { id: $postId }, votedBy: { id: $userId } }
    ) {
      id
      value
    }
  }
`;

// Mutations
export const CREATE_PERSON = gql`
  mutation($name: String!, $email: String!, $password: String!) {
    createPerson(data: { name: $name, email: $email, password: $password }) {
      id
    }
  }
`;

export const DELETE_MANY_VOTES = gql`
  mutation($postId: ID!) {
    deleteManyVotesConnection(where: { post: { id: $postId } }) {
      pageInfo {
        pageSize
      }
    }
  }
`;