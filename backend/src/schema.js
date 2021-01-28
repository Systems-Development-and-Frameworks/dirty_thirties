// source : https://github.com/Systems-Development-and-Frameworks/homework/blob/demo/demo/src/schema.js

import { stitchSchemas } from '@graphql-tools/stitch';
import { applyMiddleware } from 'graphql-middleware';
import { FilterObjectFields } from '@graphql-tools/wrap';
import typeDefs from './typeDefs';
import Resolvers from './resolvers';
import permissions from './middleware/permissions';
import GraphCmsSchema, { executor } from './graphCMS/schema';

export default async () => {
  const transforms = [
    new FilterObjectFields(
      (typeName, fieldName) => typeName !== 'Person' || fieldName !== 'password'
    ),
  ];

  const schema = await GraphCmsSchema();
  const resolvers = Resolvers([{ schema, executor }]);

  let gatewaySchema = stitchSchemas({
    subschemas: [{ schema, transforms }],
    typeDefs,
    resolvers,
  });
  return applyMiddleware(gatewaySchema, permissions);
};
