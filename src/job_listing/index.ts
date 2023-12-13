import { FastifyInstance, FastifyServerOptions } from "fastify";
import { jwtAuthentication, supabaseClient } from "../index.js";
import { uuid } from "@supabase/supabase-js/dist/main/lib/helpers.js";
import { loadUserDataPlaceholdersIntoPresentationDefinition } from "../presentation/lib.js";
import { IPresentationDefinition } from "@sphereon/pex";

export type JobListingPutBody = {
  id?: string;
  title: string;
  description?: string;
  company: string;
  presentation_definition: any; //TODO use a real type here
};

export default async function jobListingRoutes(
  server: FastifyInstance,
  options: FastifyServerOptions,
) {
  // We use a get function here instead of reading from Supabase so we can load in placeholders
  server.put<{ Body: JobListingPutBody }>("/job-listing", {
    schema: {
      headers: {
        type: "object",
        properties: {
          "x-access-token": { type: "string" },
        },
        required: ["x-access-token"],
      },
      body: {
        type: "object",
        properties: {
          "job-listing": {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              description: { type: "string" },
              company: { type: "string" },
              presentation_definition: { type: "object" },
            },
          },
        },
        required: ["job-listing"],
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      let { id, title, description, company, presentation_definition } =
        request.body;
      const putBody = {
        // If id is null, do random uuidv4
        id: id || uuid(),
        title,
        description: description || "",
        company,
        presentation_definition,
        updated_at: new Date().toLocaleString(),
      };
      console.log("putBody", putBody);
      const { data, error } = await supabaseClient.from("job_listings").upsert({
        ...putBody,
      });
      if (error) {
        return reply.status(500).send(error);
      }
      return reply.send(data);
    },
  });

  server.get<{ Params: { listingId: string } }>("/job-listing/:listingId", {
    schema: {
      headers: {
        type: "object",
        properties: {
          "x-access-token": { type: "string" },
        },
        required: ["x-access-token"],
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      const { listingId } = request.params;

      console.log("fetching job listing", listingId);
      const { data: jobListingData, error: jobListingError } =
        await supabaseClient
          .from("job_listings")
          .select("*")
          .eq("id", listingId)
          .single();

      if (jobListingError) {
        return reply.status(500).send(jobListingError);
      }
      if (!jobListingData) {
        return reply.status(404).send("Job listing not found");
      }

      console.log("jobListingData", jobListingData);

      const presentationDefinition =
        loadUserDataPlaceholdersIntoPresentationDefinition(
          // @ts-ignore
          jobListingData.presentation_definition as IPresentationDefinition,
          request.user,
        );

      console.log(
        "presentationDefinition",
        JSON.stringify(presentationDefinition, null, 2),
      );
      reply.send({
        ...jobListingData,
        presentation_definition: presentationDefinition,
      });
    },
  });
}
