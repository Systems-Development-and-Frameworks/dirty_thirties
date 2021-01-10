import { UserInputError } from 'apollo-server';
import bcrypt from 'bcrypt';
import { createTokenFor } from './utils/jwt';
import { delegateToSchema } from '@graphql-tools/delegate';
import {
  CREATE_PERSON,
  QUERY_USER_BY_EMAIL,
  QUERY_USER_BY_EMAIL_W_PASSWORD,
  QUERY_DOES_AUTHOR_HAS_POSTS,
  QUERY_POST_VOTES,
  DELETE_MANY_VOTES,
} from './utils/gql';

const PASSWORD_HASH_ROUNDS = 10;

export default ([{ schema, executor }]) => ({
  Query: {
    profile: async (_parent, _args, context, info) => {
      return await delegateToSchema({
        schema,
        operation: 'query',
        fieldName: 'person',
        args: {
          stage: 'DRAFT',
          where: {
            id: context.person.id,
          },
        },
        context,
        info,
      });
    },
  },
  Mutation: {
    // auth
    login: async (_parent, args) => {
      const { email, password } = args;

      if (password.length < 8) {
        throw new UserInputError(
          '[Validation Errors] password is shorter then 8 characters'
        );
      }

      // get User
      const {
        data: { person },
      } = await executor({
        document: QUERY_USER_BY_EMAIL_W_PASSWORD,
        variables: { email },
      });

      if (person == null) {
        // throw not found
        throw new UserInputError('User not found');
      }

      // try to authorize
      const canLogIn = bcrypt.compareSync(password, person.password);

      if (!canLogIn) {
        // throw 401 or return null
        throw new UserInputError('Unauthorized');
      }

      return 'Bearer ' + createTokenFor(person.id);
    },

    signup: async (_parent, args) => {
      const { name, email, password } = args;

      if (password.length < 8) {
        throw new UserInputError(
          '[Validation Errors] password is shorter then 8 characters'
        );
      }

      const {
        data: { person },
      } = await executor({
        document: QUERY_USER_BY_EMAIL,
        variables: { email },
      });

      // if person id exists throw error
      if (person && person.id) {
        throw new UserInputError('Email already exists.');
      }

      const passwordHash = await bcrypt.hash(
        password,
        await bcrypt.genSalt(PASSWORD_HASH_ROUNDS)
      );

      const {
        data: { createPerson },
      } = await executor({
        document: CREATE_PERSON,
        variables: { name, email, password: passwordHash },
      });

      return 'Bearer ' + createTokenFor(createPerson.id);
    },

    /**
     * Create for testing
     */
    deleteAccount: async (_parent, _args, context, info) => {
      console.log('deleteAccount', context.person);

      return await delegateToSchema({
        schema,
        operation: 'mutation',
        fieldName: 'deletePerson',
        args: {
          stage: 'DRAFT',
          where: {
            id: context.person.id,
          },
        },
        context,
        info,
      });
    },

    // posts
    write: async (_parent, args, context, info) => {
      // auth id
      const post = {
        data: {
          title: args.post.title,
          author: {
            connect: { id: context.person.id },
          },
        },
      };

      return await delegateToSchema({
        schema,
        operation: 'mutation',
        fieldName: 'createPost',
        args: post,
        context,
        info,
      });
    },

    upvote: async (_parent, args, context, info) => {
      const {
        data: { votes },
      } = await executor({
        document: QUERY_POST_VOTES,
        variables: {
          userId: context.person.id,
          postId: args.post.id,
        },
      });

      const vote = {
        data: {
          value: 1,
          votedBy: {
            connect: { id: context.person.id },
          },
          post: {
            connect: { id: args.post.id },
          },
        },
      };
      // check if user has voted and post is upvote (+1)
      // if so, do nothing
      if (votes.length > 0 && votes[0].value == 1) {
        console.log('[upvote] user has upvoted, doing nothing...');

        return;
      }

      // check if user has voted and post is downvoted (+1)
      // if so, update value on vote
      const doesPostExistAndIsUpvoted =
        votes.length > 0 && votes[0].value == -1;

      if (doesPostExistAndIsUpvoted) {
        console.log('[upvote] post is downvotes, updating...');
        // updat query
        vote.where = { id: votes[0].id };
      }

      console.log('[upvote] create a new vote for post');
      // otherwise create a new vote

      return await delegateToSchema({
        schema,
        operation: 'mutation',
        fieldName: doesPostExistAndIsUpvoted ? 'updateVote' : 'createVote',
        args: vote,
        context,
        info,
      });
    },

    downvote: async (_parent, args, context, info) => {
      const {
        data: { votes },
      } = await executor({
        document: QUERY_POST_VOTES,
        variables: {
          userId: context.person.id,
          postId: args.post.id,
        },
      });

      const vote = {
        data: {
          value: -1,
          votedBy: {
            connect: { id: context.person.id },
          },
          post: {
            connect: { id: args.post.id },
          },
        },
      };

      // check if user has voted and post is downvoted (-1)#
      // if so , do nothing
      if (votes.length > 0 && votes[0].value == -1) {
        console.log('[downvote] user has downvoted, doing nothing...');

        return;
      }

      // check if user has voted and post is upvoted (1)
      // if so, update value on vote
      const doesPostExistAndIsUpvoted = votes.length > 0 && votes[0].value == 1;

      if (doesPostExistAndIsUpvoted) {
        console.log('[downvote] post is upvoted, updating...');

        // updat query
        vote.where = { id: votes[0].id };
      }

      // otherwise create a new vote
      return await delegateToSchema({
        schema,
        operation: 'mutation',
        fieldName: doesPostExistAndIsUpvoted ? 'updateVote' : 'createVote',
        args: vote,
        context,
        info,
      });
    },

    delete: async (_parent, args, context, info) => {
      const {
        data: { posts },
      } = await executor({
        document: QUERY_DOES_AUTHOR_HAS_POSTS,
        variables: {
          postId: args.post.id,
          userId: context.person.id,
        },
      });

      // throw error if no posts avilable
      if (!posts.length) {
        throw new UserInputError(
          'This is not your post or post does not exist!'
        );
      }

      // delete all associated votes
      const {
        data: {
          deleteManyVotesConnection: { pageInfo },
        },
      } = await executor({
        document: DELETE_MANY_VOTES,
        variables: { postId: args.post.id }
      });

      console.log('deletedCount', pageInfo.pageSize);

      return await delegateToSchema({
        schema,
        operation: 'mutation',
        fieldName: 'deletePost',
        args: {
          stage: 'DRAFT',
          where: {
            id: args.post.id,
          },
        },
        context,
        info,
      });
    },
  },

  Person: {
    postCount: {
      selectionSet: '{ posts { id } }',
      resolve: (person) => person.posts.length,
    },
  },

  Post: {
    votesCount: {
      selectionSet: '{ votes {value} }',
      resolve: (post) =>
        post.votes.map((v) => v.value).reduce((a, b) => (a += b), 0),
    },
  },
});
