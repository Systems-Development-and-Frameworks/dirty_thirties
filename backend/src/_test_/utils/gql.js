import { gql } from 'apollo-server';

// auth
export const MUTATION_LOGIN = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const MUTATION_REGISTER = gql`
  mutation($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password)
  }
`;

// Users
export const QUERY_USERS = gql`
  query {
    users {
      name
    }
  }
`;

export const QUERY_USER_POSTS = gql`
  query {
    users {
      name
      posts {
        title
      }
    }
  }
`;

// posts
export const QUERY_POSTS = gql`
  query {
    posts {
      id
      title
    }
  }
`;

export const MUTATION_WRITE_POST = gql`
  mutation($post: PostInput!) {
    write(post: $post) {
      id
      title
      author {
        name
      }
    }
  }
`;

export const MUTATION_UPVOTE_POST = gql`
  mutation($id: ID!) {
    upvote(id: $id) {
      id
      title
      votes
    }
  }
`;

export const MUTATION_DOWNVOTE_POST = gql`
  mutation($id: ID!) {
    downvote(id: $id) {
      id
      title
      votes
    }
  }
`;

export const MUTATION_DELETE_POST = gql`
  mutation($id: ID!) {
    delete(id: $id) {
      id
      title
      votes
    }
  }
`;
