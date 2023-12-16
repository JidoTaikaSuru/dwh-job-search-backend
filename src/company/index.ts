import { uuid } from '@supabase/supabase-js/dist/main/lib/helpers.js';
import { FastifyInstance, FastifyServerOptions } from 'fastify';
import { jwtAuthentication, supabaseClient } from '../index.js';


export type CompanyPutBody = {
  company: {
    id?: string;
    name: string;
    description?: string;
    location: string;
    industry: string;
    num_employees: string;
  }
};

export default async function companyRoutes(
  server: FastifyInstance,
  options: FastifyServerOptions,
) {
  // We use a get function here instead of reading from Supabase so we can load in placeholders
  server.put<{ Body: CompanyPutBody }>('/company', {
    schema: {
      headers: {
        type: 'object',
        properties: {
          'x-access-token': { type: 'string' },
        },
        required: ['x-access-token'],
      },
      body: {
        type: 'object',
        properties: {
          'company': {
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              name: { type: 'string' },
              description: { type: 'string' },
              location: { type: 'string' },
              industry: { type: 'string' },
              num_employees: { type: 'string',
              enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10,000', '10,001+'] },
            },
          },
        },
        required: ['company'],
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      const { id, name, description, location, industry, num_employees } =
        request.body.company;
      const putBody = {
        // If id is null, do random uuidv4
        id: id || uuid(),
        name,
        description: description || '',
        location,
        industry,
        num_employees,
        updated_at: new Date().toLocaleString(),
      };
      console.log('putBody', putBody);
      const { data, error } = await supabaseClient.from('companies').upsert(putBody);
      if (error) {
        return reply.status(500).send(error);
      }
      return reply.send(data);
    },
  });

  server.get<{ Params: { companyId: string } }>('/company/:companyId', {
    schema: {
      headers: {
        type: 'object',
        properties: {
          'x-access-token': { type: 'string' },
        },
        required: ['x-access-token'],
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      const { companyId } = request.params;

      console.log('fetching job listing', companyId);
      const { data: companyData, error: companyError } =
        await supabaseClient
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .single();

      if (companyError) {
        return reply.status(500).send(companyError);
      }
      if (!companyData) {
        return reply.status(404).send('Job listing not found');
      }

      reply.send(companyData);
    },
  });
}
