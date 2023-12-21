import { FastifyInstance, FastifyServerOptions } from "fastify";

export type ProofOfLatencyHeaders = {
  "x-jwk": string;
};

const latency = 1000;

export default async function proofOfLatencyRoutes(
  server: FastifyInstance,
  options: FastifyServerOptions,
) {
  server.route({
    method: "POST",
    url: "/proofOfLatency",
    schema: {
      headers: {
        type: "object",
        properties: {
          "x-jwk": { type: "string" },
        },
        required: ["x-jwk"],
      },
    },

    handler: async (request, reply) => {
      const timestamp = Date.now();
      const jwk = request.headers["x-jwk"];
      
      if (!jwk) {
        return reply.status(400).send(`You are missing a required header`);
      } else if (
        Array.isArray(jwk) 
      ) {
        return reply
          .status(400)
          .send("You passed the same authorization header more than once");
      }
      
      //TODO validate jwk
      const isValid = true;
      //TODO decode the startTime timestamp from the jwk
      const startTime = 122020237020000;

      if (!isValid) {
        return reply.status(401).send("Failed to verify hash");
      }

      if(timestamp - startTime > latency){
        return reply.status(401).send("Proof of latency failed");
      }

      reply.status(200);
    },
  }),

  server.route({
    method: "GET",
    url: "/proofOfLatency",

    handler: async (request, reply) => {
     const timestamp = Date.now();
      //TODO gennerate and sign jwk annd add timestamp to encode
     const jwk = "ewricuewihwieruwqnxonawnbvuyUVYvU";
     
      return reply.status(200).send({jwk, timestamp});
    },
  });
}
