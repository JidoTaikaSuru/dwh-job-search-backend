import { IPresentationDefinition } from '@sphereon/pex';
import { FastifyInstance, FastifyServerOptions } from 'fastify';
import { Database, Json } from '../__generated__/supabase-types.js';
import {
  JWT_HEADER,
  JWT_HEADER_SCHEMA_AND_PREHANDLER,
  jwtAuthentication,
  supabaseClient,
} from '../index.js';
import { loadUserDataPlaceholdersIntoPresentationDefinition } from '../presentation/lib.js';
import { genericCreate, genericUpdate } from '../lib.js';

const uuidRegex = '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$';

export type JobListingPostBody = Database['public']['Tables']['job_listings']['Insert'];
export type JobListingPutBody = Database['public']['Tables']['job_listings']['Update']
export type JobListingSearch = {
  company?: string
  desired_salary?: string | null
  duration?: string | null
  experience_level?: string | null
  level_of_involvement?: string | null
  presentation_definition?: Json | null
  project_stage?: string | null
  required_skills?: string[] | null
  text: string | null
}

export default async function jobListingRoutes(
  server: FastifyInstance,
  options: FastifyServerOptions,
) {
  // We use a get function here instead of reading from Supabase so we can load in placeholders
  server.put<{ Body: JobListingPutBody }>('/job-listings', {
    schema: {
      headers: JWT_HEADER,
      body: {
        type: 'object',
        properties: {
          'job_listing': {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              duration: {
                type: 'string',
                enum: ['1 week', '2 weeks', '3 weeks', '4 weeks', '1 month', '2 months', '3 months', '4 months', '6 months', 'Longer than 6 months'],
              },
              experience_level: { type: 'string' },
              required_skills: {
                type: 'array',
                items: { type: 'string' },
              },
              project_stage: { type: 'string' },
              desired_salary: { type: 'string' },
              level_of_involvement: { type: 'string' },
              company: { type: 'string' },
              presentation_definition: { type: 'object' },
            },
            required: ['id', 'title', 'duration', 'experience_level', 'required_skills', 'project_stage', 'desired_salary', 'level_of_involvement', 'company'],
          },
        },
        required: ['job_listing'],
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      return genericUpdate<JobListingPutBody>('job_listings', request.body, reply);
    },
  });

  server.post<{ Body: JobListingPostBody }>('/job-listings', {
    schema: {
      headers: JWT_HEADER,
      body: {
        title: { type: 'string' },
        description: { type: 'string' },
        duration: {
          type: 'string',
          enum: ['1 week', '2 weeks', '3 weeks', '4 weeks', '1 month', '2 months', '3 months', '4 months', '6 months', 'Longer than 6 months'],
        },
        experience_level: { type: 'string' },
        required_skills: {
          type: 'array',
          items: { type: 'string' },
        },
        project_stage: { type: 'string' },
        desired_salary: { type: 'string' },
        level_of_involvement: { type: 'string' },
        company: {
          type: 'string',
          // pattern: uuidRegex
        },
        presentation_definition: { type: 'object' },
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      return genericCreate<JobListingPostBody>('job_listings', request.body, reply);
    },
  });

  server.post<{ Body: JobListingSearch }>('/job-listings/search', {
    schema: {
      headers: JWT_HEADER,
      body: {
        title: { type: 'string' },
        description: { type: 'string' },
        duration: {
          type: 'string',
          enum: ['1 week', '2 weeks', '3 weeks', '4 weeks', '1 month', '2 months', '3 months', '4 months', '6 months', 'Longer than 6 months'],
        },
        experience_level: { type: 'string' },
        required_skills: {
          type: 'array',
          items: { type: 'string' },
        },
        project_stage: { type: 'string' },
        desired_salary: { type: 'string' },
        level_of_involvement: { type: 'string' },
        company: {
          type: 'string',
          // pattern: uuidRegex
        },
        presentation_definition: { type: 'object' },
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      const {
        text,
        duration,
        experience_level,
        // required_skills,
        project_stage,
        desired_salary,
        level_of_involvement,
        company,
      } = request.body;
      const baseQuery = supabaseClient.from('job_listings').select('*');
      if (text) {
        baseQuery.or(`title.ilike.*${text}*,description.ilike.*${text}*`);
      }
      if (duration) {
        baseQuery.eq('duration', duration);
      }
      if (experience_level) {
        baseQuery.eq('experience_level', experience_level);
      }
      // if (required_skills) {
      //   console.log(required_skills)
      //   baseQuery.likeAnyOf('required_skills', required_skills);
      // }
      if (project_stage) {
        baseQuery.eq('project_stage', project_stage);
      }
      if (desired_salary) {
        baseQuery.eq('desired_salary', desired_salary);
      }
      if (level_of_involvement) {
        baseQuery.eq('level_of_involvement', level_of_involvement);
      }
      if (company) {
        baseQuery.eq('company', company);
      }

      const { data, error } = await baseQuery;
      if (error) {
        return reply.status(500).send(error);
      }
      return reply.send(data || []);
    },
  });

  server.get<{ Params: { listingId: string } }>('/job-listings/:listingId', {
    ...JWT_HEADER_SCHEMA_AND_PREHANDLER,
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

  server.get<{ Querystring: { includePresentationDefinitions?: boolean } }>('/job-listings', {
    ...JWT_HEADER_SCHEMA_AND_PREHANDLER,
    handler: async (request, reply) => {
      console.log('fetching job listings');
      const { data: jobListingData, error: jobListingError } =
        await supabaseClient
          .from('job_listings')
          .select('*');
      if (jobListingError) {
        return reply.status(500).send(jobListingError);
      }
      if (!jobListingData) {
        return reply.status(404).send('No job listings found');
      }

      // Process each listing for presentation definitions as per the includePresentationDefinitions flag
      if (request.query.includePresentationDefinitions) {
        jobListingData.map(jobListing => {
          console.log('jobListingData', jobListing);
          const presentationDefinition =
            loadUserDataPlaceholdersIntoPresentationDefinition(
              // @ts-expect-error We know it's an IPresentationDefinition because that's how its stored. Supabase is unaware of typeorm
              jobListing.presentation_definition as IPresentationDefinition,
              request.user,
            );
          console.log(
            'presentationDefinition',
            JSON.stringify(presentationDefinition, null, 2),
          );

          return {
            ...jobListing,
            presentation_definition: presentationDefinition,
          };
        });
      }

      reply.send(jobListingData);
    },
  });
}
