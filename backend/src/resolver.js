
//1. List all posts
//2. List all users
//3. Create a post
//4. Upvote a post
import { UserInputError } from 'apollo-server';

// Resolvers define the technique for fetching the types defined in the
// schema
const resolvers = {
  //possible Queries
  Query: {
      users: (parent, args, context) => context.dataSources.ds.allUsers(),
      posts: (parent, args, context) => context.dataSources.ds.allPosts(),
  },

  //possible mutations - for now just Creation of a new Post
  Mutation: {
    async write(parent, args, context) {
        const newPost = {
            title: args.post.title,
            authorName: args.post.author.name,
        };
        const author = await context.dataSources.ds.getUser(newPost.authorName);
        if (!author) {
            throw new UserInputError("Invalid user", { invalidArgs: newPost.authorName });
        }
        // console.log(context.dataSources.db.createPost(newPost));
        return await context.dataSources.ds.createPost(newPost);
    },

    upvote: async (parent, args, context) => {
      const upvoter = await context.dataSources.ds.getUser(args.voter.name);
      if (!upvoter) {
          throw new UserInputError("Invalid user", { invalidArgs: args.voter.name });
      }
      const post = await context.dataSources.ds.getPost(args.id);
      if (!post) {
          throw new UserInputError("Invalid post", { invalidArgs: args.id });
      }
      // console.log(context.dataSources.db.upvotePost(args.id, args.voter.name));
      return await context.dataSources.ds.upvotePost(args.id, args.voter.name);
    },
  },

  //Posts asynchroniously - votes and authors
  Post: {
    async author(obj, args, context) {
        return await context.dataSources.ds.getUser(obj.authorName);
    },
    async votes(obj, args, context) {
        let values = Array.from(obj.voters.values());
        let votes = values.reduce((sum, number) => sum + number, 0);
        return votes;
    },
  },

  //Users - allPosts
  User: {
    async posts(obj, args, context) {
        const allPosts = await context.dataSources.ds.allPosts();
        return allPosts.filter((post) => post.authorName === obj.name);
    },
  },
};

export default resolvers;
