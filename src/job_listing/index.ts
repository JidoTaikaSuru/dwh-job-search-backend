import { IPresentationDefinition } from '@sphereon/pex';
import { uuid } from '@supabase/supabase-js/dist/main/lib/helpers.js';
import { FastifyInstance, FastifyServerOptions } from 'fastify';
import { jwtAuthentication, supabaseClient } from '../index.js';
import { loadUserDataPlaceholdersIntoPresentationDefinition } from '../presentation/lib.js';

const uuidRegex = '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$'

export type JobListingPutBody = {
  id?: string;
  title: string;
  duration: string;
  experience_level: string;
  required_skills: string[];
  project_stage: string;
  desired_salary: string;
  level_of_involvement: string;
  company: string;
  presentation_definition: any; //TODO use a real type here
};

export default async function jobListingRoutes(
  server: FastifyInstance,
  options: FastifyServerOptions,
) {
  // We use a get function here instead of reading from Supabase so we can load in placeholders
  server.put<{ Body: JobListingPutBody }>('/job-listing', {
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
          'job-listing': {
            type: 'object',
            properties: {
              id: {
                type: 'string'
              },
              title: { type: 'string' },
              duration: {
                type: 'string',
                enum: ['4 weeks', '1 month', '2 months', '3 months', '4 months', '6 months', 'Longer than 6 months']
              },
              experience_level: { type: "string"},
              required_skills: {
                type: 'array',
                items: { type: 'string' }
              },
              project_stage: {type: 'string'},
              desired_salary: { type: "string"},
              level_of_involvement: { type: "string"},
              company: {
                type: 'string',
                // pattern: uuidRegex
              },
              presentation_definition: { type: 'object' },
            },
          },
        },
        required: ['job-listing'],
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      const { id, title, duration, experience_level, required_skills, project_stage, desired_salary, level_of_involvement, company, presentation_definition } =
        request.body;
      const putBody = {
        // If id is null, do random uuidv4
        id: id || uuid(),
        title,
        description: '',
        duration,
        experience_level,
        required_skills,
        project_stage,
        desired_salary,
        level_of_involvement,
        company,
        presentation_definition,
        updated_at: new Date().toLocaleString(),
      };
      console.log('putBody', putBody);
      const { data, error } = await supabaseClient.from('job_listings').upsert({
        ...putBody,
      });
      if (error) {
        return reply.status(500).send(error);
      }
      return reply.send(data);
    },
  });

  server.get<{ Params: { listingId: string } }>('/job-listing/:listingId', {
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
      const { listingId } = request.params;

      console.log('fetching job listing', listingId);
      const { data: jobListingData, error: jobListingError } =
        await supabaseClient
          .from('job_listings')
          .select('*')
          .eq('id', listingId)
          .single();

      if (jobListingError) {
        return reply.status(500).send(jobListingError);
      }
      if (!jobListingData) {
        return reply.status(404).send('Job listing not found');
      }

      console.log('jobListingData', jobListingData);

      const presentationDefinition =
        loadUserDataPlaceholdersIntoPresentationDefinition(
          // @ts-expect-error this is a shortcut. We know it's an IPresentationDefinition because that's how its stored. Supabase is unaware of typeorm
          jobListingData.presentation_definition as IPresentationDefinition,
          request.user,
        );

      console.log(
        'presentationDefinition',
        JSON.stringify(presentationDefinition, null, 2),
      );
      reply.send({
        ...jobListingData,
        presentation_definition: presentationDefinition,
      });
    },
  });
}
