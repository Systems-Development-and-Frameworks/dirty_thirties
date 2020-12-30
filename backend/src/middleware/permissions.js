import { rule, shield, allow } from 'graphql-shield';
import { verifyToken } from './../utils/jwt';

// Rules
const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, ctx) => {
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

const isOwner = rule({ cache: 'contextual' })(async (parent, args, ctx) => {
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
        users: isAuthenticated,
    },
    Mutation: {
      write: isAuthenticated,
     upvote: isAuthenticated,
     downvote: isAuthenticated,
     delete: isOwner,
    },
  },
  {
    debug: true,
    fallbackRule: allow,
  }
);

export default permissions;
