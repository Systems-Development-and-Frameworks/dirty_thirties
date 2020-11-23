//import of schema, resolver, Server and DataSource
import typeDefs from './typeDefs.js'
import resolver from './resolver.js'
import { ApolloServer, gql } from 'apollo-server'
import { InMemoryDataSource, Post, User } from './ds.js'

const ds = new InMemoryDataSource()
ds.posts = [new Post({ title: 'post'})] //not sure if it´s correct like this
ds.user = [new User({"Klaus Kaufmann"})] //not sure if it´s correct like this

const dataSources = () => ({ ds })

const context = ({ req, res }) => ({ req, res })

export default class Server {
  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  constructor (opts) {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources,
      context
    }
    return new ApolloServer({ ...defaults, ...opts })
  }
}
