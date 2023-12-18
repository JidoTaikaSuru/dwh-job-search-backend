import { FastifyInstance, FastifyServerOptions } from 'fastify';
import { Database } from '../__generated__/supabase-types.js';
import {
  JWT_HEADER,
  JWT_HEADER_SCHEMA_AND_PREHANDLER,
  jwtAuthentication,
  supabaseClient,
} from '../index.js';
import { genericCreate, genericFetchAll, genericFetchById, genericUpdate } from '../lib.js';


export type CompanyPostBody = Database['public']['Tables']['companies']['Insert'];
export type CompanyPutBody = Database['public']['Tables']['companies']['Update'];


export default async function companyRoutes(
  server: FastifyInstance,
  options: FastifyServerOptions,
) {
  server.get('/companies', {
    ...JWT_HEADER_SCHEMA_AND_PREHANDLER,
    handler: async (request, reply) => {
      return await genericFetchAll('companies', reply);
    },
  });

  server.get<{ Params: { companyId: string } }>('/companies/:companyId', {
    ...JWT_HEADER_SCHEMA_AND_PREHANDLER,
    handler: async (request, reply) => {
      console.log('request.params', request.params);
      return await genericFetchById('companies', request.params.companyId, reply);
    },
  });
  server.post<{ Body: CompanyPostBody }>('/companies', {
    schema: {
      headers: JWT_HEADER,
      body: {
        name: { type: 'string' },
        description: { type: 'string' },
        location: { type: 'string' },
        industry: { type: 'string' },
        num_employees: {
          type: 'string',
          enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10,000', '10,001+'],
        },
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      return genericCreate<CompanyPostBody>('companies', request.body, reply);
    },
  });

  server.post<{ Body: CompanyPostBody }>('/companies/search', {
    schema: {
      headers: JWT_HEADER,
      body: {
        name: { type: ['string', 'null'] },
        description: { type: ['string', 'null']},
        location: { type: ['string','null'] },
        industry: { type: ['string', 'null'] },
        num_employees: { type: ['string', 'null'], },
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      const baseQuery = supabaseClient.from('companies').select('*');
      const { name, description, location, industry, num_employees } = request.body;
     console.log(request.body)
      const textSearch: string[] = []
      if(name){
        textSearch.push(`name.ilike.*${name}*`)
      }
      if(description){
        textSearch.push(`description.ilike.*${name}`)
      }
      if(location){
        baseQuery.eq("location", location)
      }
      if(industry){
        baseQuery.eq("industry", industry)
      }
      if(num_employees){
        baseQuery.eq("num_employees", num_employees)
      }
      baseQuery.or(textSearch.join(","))

      const {data, error} = await baseQuery;
      if(error){
        return reply.status(500).send(error)
      }
      return reply.send(data)
    },
  });

  server.put<{ Body: CompanyPutBody }>('/companies/:companyId', {
    schema: {
      headers: JWT_HEADER,
      body: {
        id: {
          type: 'string',
        },
        name: { type: 'string' },
        description: { type: 'string' },
        location: { type: 'string' },
        industry: { type: 'string' },
        num_employees: {
          type: 'string',
          enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10,000', '10,001+'],
        },
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      return genericUpdate<CompanyPutBody>('companies', request.body, reply);
    },
  });
}
