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

export type JobReplyPostBody = Omit<Database['public']['Tables']['job_replies']['Insert'], 'id' | 'created_at'>;
export type JobReplyPutBody = Database['public']['Tables']['job_replies']['Update'];

export default async function jobReplyRoutes(
  server: FastifyInstance,
  options: FastifyServerOptions,
)
{
  server.get('/job_replies', {
    ...JWT_HEADER_SCHEMA_AND_PREHANDLER,
    handler: async (request, reply) => {
      return await genericFetchAll('job_replies', reply);
    },
  });

  server.get<{ Params: { jobReplyId: string } }>('/job_replies/:jobReplyId', {
    ...JWT_HEADER_SCHEMA_AND_PREHANDLER,
    handler: async (request, reply) => {
      return await genericFetchById('job_replies', request.params.jobReplyId, reply);
    },
  });

  server.post<{ Body: JobReplyPostBody }>('/job_replies', {
    schema: {
      headers: JWT_HEADER,
      body: {
        type: 'object',
        properties: {
          'job_reply': {
            type: 'object',
            properties: {
              job_listing_id: { type: 'string' },
              resume: { type: 'string' },
              user_id: { type: 'string' },
            },
          },
        },
        required: ['job_reply'],
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      return genericCreate<JobReplyPostBody>('job_replies', request.body, reply);
    },
  });

  server.post<{ Body: JobReplyPostBody }>('/job_replies/search', {
    schema: {
      headers: JWT_HEADER,
      body: {
        type: 'object',
        properties: {
          'job_reply': {
            type: 'object',
            properties: {
              job_listing_id: { type: 'string' },
              resume: { type: 'string' },
              user_id: { type: 'string' },
            },
          },
        },
        required: ['job_reply'],
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      const {job_listing_id, resume, user_id} = request.body;
     const baseQuery = supabaseClient.from('job_replies').select('*');
      if (job_listing_id) {
        baseQuery.eq('job_listing_id', job_listing_id);
      }
      if (resume) {
        baseQuery.ilike('resume', resume);
      }
      if (user_id) {
        baseQuery.eq('user_id', user_id);
      }
      const { data, error } = await baseQuery;
      if (error) {
        return reply.status(500).send(error);
      }
      return reply.send(data || []);
    },
  });

  server.put<{ Body: JobReplyPutBody }>('/job_replies/:jobReplyId', {
    schema: {
      headers: JWT_HEADER,
      body: {
        type: 'object',
        properties: {
          'job_reply': {
            type: 'object',
            properties: {
              id: { type: 'string' },
              job_listing_id: { type: 'string' },
              resume: { type: 'string' },
              user_id: { type: 'string' },
            },
          },
        },
        required: ['job_reply'],
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      return genericUpdate<JobReplyPutBody>('job_replies', request.body, reply);
    },
  });
}