import { rule, shield, allow } from 'graphql-shield';


// Permissions
const permissions = shield(
  {
    Query: {
        // later
    },
    Mutation: {
        //later
    },
  },
  {
    debug: true,
    fallbackRule: allow,
  }
);

export default permissions;
