
//1. List all posts
//2. List all users
//3. Create a post
//4. Upvote a post
import { UserInputError } from 'apollo-server';
import bcrypt from "bcrypt";
import {createTokenFor} from './utils/jwt';

export default {
  Query: {
    posts: (parent, args, context) => context.dataSources.db.allPosts(),
    users: (parent, args, context) => context.dataSources.db.allUsers(),
  },

  Mutation: {
    login: (parent, args, context) => {
      const { email, password } = args;

      if (password.length < 8) {
        throw new UserInputError('400', {
          invalidArgs:
            '[Validation Errors] password is shorter then 8 characters',
        });
      }

      // get User
      const user = context.dataSources.db.getUserByEmail(email);

      if (user == null) {
        // throw not found
        throw new UserInputError('404', {
          invalidArgs: 'user not found',
        });
      }

      // try to authorize
      const canLogIn = bcrypt.compareSync(password, user.password);

      if (!canLogIn) {
        // throw 401 or return null
        throw new UserInputError('401', {
          invalidArgs: 'Unauthorized',
        });
      }
      return 'Bearer ' + createTokenFor(user);
    },

    signup: (parent, args, context) => {
      const { name, email, password } = args;

      if (password.length < 8) {
        throw new UserInputError('400', {
          invalidArgs:
            '[Validation Errors] password is shorter then 8 characters',
        });
      }

      // try to find if the email already exist
      const userExist = context.dataSources.db.getUserByEmail(email);

      if (userExist != null) {
        // 409 Conflict
        throw new UserInputError('409', {
          invalidArgs: 'Email is already taken',
        });
      }

      const newUser = context.dataSources.db.createUser(name, email, password);

      return 'Bearer ' + createTokenFor(newUser);
    },

    write: (parent, args, context) => {
      const newPost = {
        title: args.post.title,
        authorid: context.req.auth.id,
        votes: 0,
      };

      return context.dataSources.db.createPost(newPost);
    },
    
    upvote: (parent, args, context) => {
      const post = context.dataSources.db.getPost(args.id);

      if (!post) {
        throw new UserInputError('Invalid post', { invalidArgs: args.postId });
      }

      return context.dataSources.db.upvotePost(post.id, context.req.auth.id);
    },

    downvote: (parent, args, context) => {
      const post = context.dataSources.db.getPost(args.id);

      if (!post) {
        throw new UserInputError('Invalid post', { invalidArgs: args.postId });
      }

      return context.dataSources.db.downvotePost(post.id, context.req.auth.id);
    },


    delete: (parent, args, context) => {
      return context.dataSources.db.deletePost(args.id);
    },
  },

  Post: {
    author(obj, args, context) {
      return context.dataSources.db.getUser(obj.authorid);
    },
    votes(obj) {
      return obj.voters.size;
    },
  },

  //Users - allPosts
  User: {
    posts(obj, args, context) {
      return context.dataSources.db
        .allPosts()
        .filter((post) => post.authorid === obj.id);
    },
  },
};
