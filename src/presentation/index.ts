import { FastifyInstance, FastifyServerOptions } from "fastify";
import { jwtAuthentication, supabaseClient } from "../index.js";
import { IVerifiableCredential } from "@sphereon/ssi-types";
import { IPresentationDefinition } from "@sphereon/pex";
import { loadUserDataPlaceholdersIntoPresentationDefinition } from "./lib.js";

export type PresentationExchangePostBody = {
  claims: IVerifiableCredential;
  jobListing: string;
};

export default async function presentationRoutes(
  server: FastifyInstance,
  options: FastifyServerOptions,
) {
  server.post<{ Body: PresentationExchangePostBody }>("/presentation", {
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
          claims: {
            type: "array",
          },
          jobListing: {
            type: "string",
          },
        },
        required: ["claims", "jobListing"],
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      const { jobListing } = request.body;
      console.log("fetching job listing", jobListing);
      const { data: jobListingData, error: jobListingError } =
        await supabaseClient
          .from("job_listings")
          .select("*")
          .eq("id", jobListing)
          .single();
      if (jobListingError) {
        return reply.status(500).send(jobListingError);
      }
      if (!jobListingData) {
        return reply.status(404).send("Job listing not found");
      }
      
      console.log("jobListingData", jobListingData);

      const presentationDefinition = loadUserDataPlaceholdersIntoPresentationDefinition(
        // @ts-ignore
        jobListingData.presentation_definition as IPresentationDefinition,
        request.user,
      );


      console.log("presentationDefinition", JSON.stringify(presentationDefinition, null, 2))
      reply.send(presentationDefinition);
      //   // request.body;
      // const putBody = {
      //   // If id is null, do random uuidv4
      //   id: id || uuid(),
      //   title,
      //   description: description || "",
      //   company,
      //   presentation_definition,
      //   updated_at: new Date().toLocaleString(),
      // };
      // console.log("putBody", putBody);
      // const { data, error } = await supabaseClient.from("job_listings").upsert({
      //   ...putBody,
      // });
      // if (error) {
      //   return reply.status(500).send(error);
      // }
      // return reply.send(data);
    },
  });
}
