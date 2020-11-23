import { createRequire } from 'module';

//Apollo Server
const { ApolloServer, gql } = require('apollo-server');

//consts for users and posts
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


// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
