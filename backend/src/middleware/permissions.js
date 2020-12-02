import { rule, shield, allow } from 'graphql-shield';
import { verifyToken } from './../utils/jwt';

// Rules
const isAuthenticated = rule({ cache: 'no_cache' })(
  async (parent, args, ctx, info) => {
    let token = ctx.req.headers.authorization;

    try {
      const decodedUser = verifyToken(token);
      const user = ctx.dataSources.db.getUser(decodedUser.id);

      if (user) {
        ctx.req.auth = user;
        return true;
      }
    } catch (error) {
      console.log('err', error);
      return false;
    }
    return false;
  }
);

// Permissions
const permissions = shield(
  {
    Query: {
        users: isAuthenticated,
    },
    Mutation: {
      // write: isAuthenticated,
     // upvote: isAuthenticated
    },
  },
  {
    debug: true,
    fallbackRule: allow,
  }
);

export default permissions;
