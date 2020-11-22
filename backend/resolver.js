
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    posts: (parent, args, context) => {
      console.log('Hello this is the posts Query')
      console.log('parent', parent)
      console.log('args', args)
      console.log('context', context)
      return context.dataSources.ds.posts
    }
    //users: (parent, args, context, info) => users,
  },

  Post: {

  },

  User: {

  },

  Mutation: {
    write (parent, args, context) => context.dataSources.db.createPost(args)
  }
}

//1. List all posts

//2. List all users

//3. Create a post

//4. Upvote a post
