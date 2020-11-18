//import of schema and resolver 
import typeDefs from './typeDefs.js'
import resolver from './resolver.js'

//Apollo Server
const { ApolloServer, gql } = require('apollo-server');

//Konstanten User - evtl nicht nötig weil ja nicht konstant 
const users = [
  {
    name: 'Klaus Meier', //name of the user
    postIds: [1, 2], //get List of Posts
  },
  {
    name: 'Maria Müller', //name of the user
    postIds: [3], //get List of Posts
  },
];

const posts = [
  {
    id: 1,
    title: 'Post 1',
    votes: 3, //Achtung, darf nicht statisch sein
  },
  {
    id: 2,
    title: 'Post 2',
    votes: 7, //Achtung, darf nicht statisch sein
  },
  {
    id: 3,
    title: 'Post 3',
    votes: 5, //Achtung, darf nicht statisch sein
  },
];

//jede Person nur 1x upvoten - siehe Hints (Mengen) -> sets


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ 
  typeDefs,
  resolvers 
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

import { DataSource } from 'apollo-datasource'

export default class InMemoryDataSource extends DataSource {
  constructor () {
    super()
    //befüllen ggfs. this.
    this.post = []
  }

  initialize ({ context }) {
    console.log('InMemoryDataSource: ', context)
  }

  allPosts (data) {}
  createPost (data) {
    const newPost = new Post(data)
    this.posts.push(newPost)
    return newPost
  }
  upvotePost(id, user) {}
}


