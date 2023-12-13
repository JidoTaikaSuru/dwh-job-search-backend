import { FastifyInstance, FastifyServerOptions } from "fastify";
import { agent, DEFAULT_IDENTIFIER_SCHEMA } from "../setup.js";
import { argon2Verify } from "hash-wasm";

const challenge = `(answerHex.match(/0000/g) || []).length > 0`

export type ProofOfWorkHeaders = {
  "x-challenge-hash": string;
  "x-client-id": string;
};

export default async function proofOfWorkRoutes(
  server: FastifyInstance,
  options: FastifyServerOptions,
) {
  server.route({
    method: "POST",
    url: "/proofOfWork",
    schema: {
      headers: {
        type: "object",
        properties: {
          "x-challenge-hash": { type: "string" },
          "x-client-id": { type: "string" },
        },
        required: ["x-challenge-hash", "x-client-id"],
      },
    },

    handler: async (request, reply) => {
      const clientDid = request.headers["x-client-id"];
      const challengeHash = request.headers["x-challenge-hash"];;
      if (!clientDid || !challengeHash) {
        return reply.status(400).send(`You are missing a required header`);
      } else if (
        Array.isArray(clientDid) ||
        Array.isArray(challengeHash)
      ) {
        return reply
          .status(400)
          .send("You passed the same authorization header more than once");
      }

      const { did } = await agent.didManagerGetByAlias({
        alias: DEFAULT_IDENTIFIER_SCHEMA,
      });

      const isValid = await argon2Verify({
        password: did + clientDid,
        hash: challengeHash,
      });

      if (!isValid) {
        return reply.status(401).send("Failed to verify hash");
      }
      reply.status(200);
    },
  }),

  server.route({
    method: "GET",
    url: "/proofOfWork/getChallenge",
    schema: {
      headers: {
        type: "object",
        properties: {
          "x-client-id": { type: "string" },
        },
        required: ["x-client-id"],
      },
    },

    handler: async (request, reply) => {
      const clientDid = request.headers["x-client-id"];
      if (!clientDid) {
        return reply.status(400).send(`You are missing a required header`);
      } else if (
        Array.isArray(clientDid)
      ) {
        return reply
          .status(400)
          .send("You passed the same authorization header more than once");
      }

      const { did } = await agent.didManagerGetByAlias({
        alias: DEFAULT_IDENTIFIER_SCHEMA,
      });

      return reply.status(200).send({serverDid: did, challenge});
    },
  });
}
