
//1. List all posts
//2. List all users
//3. Create a post
//4. Upvote a post
import { UserInputError } from 'apollo-server';

export default {
  Query: {
    posts: (parent, args, context) => context.dataSources.db.allPosts(),
    users: (parent, args, context) => context.dataSources.db.allUsers(),
  },

  Mutation: {
    createPost: (parent, args, context) => {
      // throw error if user does not exist
      const user = context.dataSources.db.getUser(args.userId);
      if (!user) {
        throw new UserInputError('Invalid user', {
          invalidArgs: 'Userid does not exist',
        });
      }

      const newPost = {
        title: args.title,
        authorid: args.userId,
        votes: 0,
      };

      return context.dataSources.db.createPost(newPost);
    },

    upvotePost: (parent, args, context) => {
      const voter = context.dataSources.db.getUser(args.userId);
      if (!voter) {
        throw new UserInputError('Invalid user', {
          invalidArgs: 'Userid does not exist',
        });
      }

      const post = context.dataSources.db.getPost(args.id);
      if (!post) {
        throw new UserInputError('Invalid post', { invalidArgs: args.id });
      }

      return context.dataSources.db.upvotePost(post.id, voter.id);
    },

    downvotePost: (parent, args, context) => {
      const voter = context.dataSources.db.getUser(args.userId);
      if (!voter) {
        throw new UserInputError('Invalid user', {
          invalidArgs: 'Userid does not exist',
        });
      }

      const post = context.dataSources.db.getPost(args.id);
      if (!post) {
        throw new UserInputError('Invalid post', { invalidArgs: args.id });
      }

      return context.dataSources.db.downvotePost(post.id, voter.id);
    },

    deletePost: (parent, args, context) => {
      const user = context.dataSources.db.getUser(args.userId);
      if (!user) {
        throw new UserInputError('Invalid user', {
          invalidArgs: `Userid ${args.userId} does not exist`,
        });
      }

      const post = context.dataSources.db.getPost(args.id);
      if (!post) {
        throw new UserInputError('Invalid post', {
          invalidArgs: `Post ${args.id} does not exist`,
        });
      }

      if (post.authorid !== user.id) {
        throw new UserInputError('Not Allowed', {
          invalidArgs: `User does not create the post and can not delete it`,
        });
      }

      return context.dataSources.db.deletePost(post.id);
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
