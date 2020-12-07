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