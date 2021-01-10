import { rule, shield, allow, deny } from 'graphql-shield';

import { ForbiddenError } from 'apollo-server';

// Rules
/*
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
      return false;
    }

    return false;
  }
);
*/

const isAuthenticated = rule({ cache: 'contextual' })(
  async (_parent, _args, context) => {
    if (context.person == undefined) {
      return 'Not Authorised!';
    }
    return !!context.person.id;
  }
);


// Permissions
const permissions = shield(
  {
    Query: {
      //users: isAuthenticated,
      '*': deny,
      profile: isAuthenticated,
      posts: allow,
      post: allow,
      people: allow,
      person: allow,
    },
    Mutation: {
      '*': deny,
      // auth
      login: allow,
      signup: allow,
      deleteAccount: isAuthenticated,

      write: isAuthenticated,
      upvote: isAuthenticated,
      downvote: isAuthenticated,
      delete: isAuthenticated,
    },
  },
  {
    debug: true,
    fallbackRule: allow,
    fallbackError: new ForbiddenError('Not Authorised!'),
  }
);

export default permissions;
