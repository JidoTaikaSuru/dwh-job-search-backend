// TypeScript

import { FastifyInstance, FastifyServerOptions } from 'fastify';
import { Database } from '../__generated__/supabase-types.js';
import {
  genericCreate,
  genericFetchAll,
  genericFetchById,
  genericUpdate,
  JWT_HEADER,
  JWT_HEADER_SCHEMA_AND_PREHANDLER,
  jwtAuthentication,
  supabaseClient,
} from '../index.js';

export type UserPostBody = Omit<Database['public']['Tables']['users']['Insert'], 'id' | 'created_at'>;
export type UserPutBody = Database['public']['Tables']['users']['Update'];
export type UserSearchBody = {
  name: string,
  did: string,
  public_key: string,
};

export default async function userRoutes(
  server: FastifyInstance,
  options: FastifyServerOptions,
) {
  server.get('/users', {
    ...JWT_HEADER_SCHEMA_AND_PREHANDLER,
    handler: async (request, reply) => {
      return await genericFetchAll('users', reply);
    },
  });

  server.get<{ Params: { userId: string } }>('/users/:userId', {
    ...JWT_HEADER_SCHEMA_AND_PREHANDLER,
    handler: async (request, reply) => {
      return await genericFetchById('users', request.params.userId, reply);
    },
  });

  server.post<{ Body: UserPostBody }>('/users', {
    schema: {
      headers: JWT_HEADER,
      body: {
        type: 'object',
        properties: {
          'user': {
            type: 'object',
            properties: {
              did: { type: [ 'string', 'null' ] },
              iv: { type: [ 'string', 'null' ] },
              password_encrypted_private_key: { type: [ 'string', 'null' ] },
              public_key: { type: [ 'string', 'null' ] },
              name: { type: ['string', 'null'] },
            },
          },
        },
        required: ['user'],
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      return genericCreate<UserPostBody>('users', request.body, reply);
    },
  });

  server.post<{Body: UserSearchBody}>("/users/search", {
    schema: {
      headers: JWT_HEADER,
      body: {
        type: 'object',
        properties: {
          'name': { type: 'string', },
          'did': { type: 'string', },
          'public_key': { type: 'string', },
        },
        required: ['name'],
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      const usersQuery = supabaseClient.from('users').select('*');
      const {did, name, public_key} = request.body;

      if (request.body.did) {
        usersQuery.eq('did', did);
      }
      if (request.body.name) {
        usersQuery.ilike('name', `*${name}*`);
      }
      if (request.body.public_key) {
        usersQuery.eq('public_key', request.body.public_key);
      }

      const { data: users, error: fetchError } = await usersQuery;

      if (fetchError) {
        return reply.status(400).send(fetchError);
      }
      return reply.status(200).send(users);
    },
  });

  server.put<{ Body: UserPutBody }>('/users/:userId', {
    schema: {
      headers: JWT_HEADER,
      body: {
        type: 'object',
        properties: {
          'user': {
            type: 'object',
            properties: {
              id: { type: 'string' },
              did: { type: [ 'string', 'null' ] },
              iv: { type: [ 'string', 'null' ] },
              password_encrypted_private_key: { type: [ 'string', 'null' ] },
              public_key: { type: [ 'string', 'null' ] },
              name: { type: [ 'string', 'null' ] },
            },
          },
        },
        required: ['user'],
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      return genericUpdate<UserPutBody>('users', request.body, reply);
    },
  });
}