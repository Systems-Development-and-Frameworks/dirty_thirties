import { rule, shield, allow, deny } from 'graphql-shield';
import { verifyToken } from './../utils/jwt';

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
    console.log('rule:isAuthenticated ', context);
    return !!context.person.id;
  }
);

const isOwner = rule({ cache: 'no_cache' })(async (_parent, args, ctx) => {
  let token = ctx.req.headers.authorization;

  try {
    const decodedUser = verifyToken(token);

    const user = ctx.dataSources.db.getUser(decodedUser.id);
    const post = ctx.dataSources.db.getPost(args.id);

    if (user && post) {
      ctx.req.auth = user;
      return post.authorid === user.id;
    }
  } catch (error) {
    return false;
  }

  return false;
});

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
      delete: isAuthenticated, //isOwner,
    },
  },
  {
    debug: true,
    fallbackRule: allow,
    fallbackError: new ForbiddenError('Not Authorised!'),
  }
);

export default permissions;
