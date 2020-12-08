import { MUTATION_LOGIN } from './gql';

export const loginUser = async (
  mutate,
  email = 'sarah@email.com',
  password = 'marzipan'
) => {
  const {
    data: { login },
  } = await mutate({
    mutation: MUTATION_LOGIN,
    variables: { email, password },
  });

  return login;
};