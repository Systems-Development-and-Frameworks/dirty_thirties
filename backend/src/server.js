//import of schema, resolver, Server and DataSource
import { ApolloServer } from 'apollo-server';
import typeDefs from './typeDefs';
import { Post, User, InMemoryDataSource } from './db';
import resolvers from './resolvers';

const ds = new InMemoryDataSource();

// create Users
db.users = [new User('Jenny V.'), new User('Sarah M.'), new User('Nele H.')];

// create posts
db.posts = [
  new Post({ title: 'a test post', authorid: db.users[0].id }),
  new Post({ title: 'an exciting post', authorid: db.users[1].id }),
  new Post({ title: 'an new post', authorid: db.users[1].id }),
];

const dataSources = () => ({ db });
const context = ({ req, res }) => ({ req, res });

export default class Server {
  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  constructor(opts) {
    const defaults = {
      typeDefs,
      resolvers,
      dataSources,
      context,
    };
    return new ApolloServer({ ...defaults, ...opts });
  }
};
