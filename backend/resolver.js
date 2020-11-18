

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    posts: (parent, args, context, info) => posts,  ((context.dataSources.db ? ))
    users: (parent, args, context, info) => users,
  },

  Post: {


  },

  User: {


  },

  Mutation: {
    write (parent, args) {
      //write the function
      //return type Post
    }

    delete (parent, args) {
      //write the function
      //return type Post

    }    

    update (parent, args) {
      //write the function
      //return type Post

    }
    
    downvote (parent, args) {
      //write the function
      //return type Post

    }
  }

};

//1. List all posts

//2. List all users

//3. Create a post

//4. Upvote a post
