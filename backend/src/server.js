//import of schema, resolver, Server and DataSource
import { ApolloServer, gql } from 'apollo-server';
import typeDefs from './typeDefs.js';
import resolver from './resolver.js';
import InMemoryDataSource, { Post, User } from './ds.js';

const ds = new InMemoryDataSource();
//console.log(ds);
//console.log(ds.posts);

ds.posts.push(new Post({ title: 'Test Post', authorName: 'Jenny V.' }));
ds.users.push(new User('Jenny V.'), new User('Sarah M.'));

const dataSources = () => ({ ds });

const context = ({ req, res }) => ({ req, res });

export default class Server {
  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  constructor (opts) {
    const defaults = {};
    const server = new ApolloServer({
      ...defaults,
      ...opts,
      typeDefs,
      resolver,
      dataSources,
      context
    });
    return server;
  }
};
