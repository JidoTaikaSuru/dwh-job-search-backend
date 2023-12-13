import { FastifyInstance, FastifyServerOptions } from "fastify";
import { agent, DEFAULT_IDENTIFIER_SCHEMA } from "../setup.js";
import { argon2id, argon2Verify } from "hash-wasm";

export type ProofOfWorkHeaders = {
  "X-Challenge-Hash": string;
  "X-Client-Id": string;
  "X-Challenge-Salt": string;
};

// default timeout value equal 100 seconds
const defaultValidTimeout = 100000;

// timeout delta to increase or decrease the valid timeout
// depending on successfull or failed proof of work
const timeoutDelta = 10000;

const answerHashVariable = "answerHash";

const challengeBody = "00000";

export default async function proofOfWorkRoutes(
  server: FastifyInstance,
  options: FastifyServerOptions,
) {
  server.post<{ Headers: ProofOfWorkHeaders }>("/proofOfWork", {
    schema: {
      headers: {
        type: "object",
        properties: {
          "X-Challenge-Hash": { type: "string" },
          "X-Client-Id": { type: "string" },
          "X-Challenge-Salt": { type: "string" },
        },
        required: ["X-Challenge-Hash", "X-Client-Id", "X-Challenge-Salt"],
      },
      // body: {
      //   type: "object",
      //   properties: {
      //     did: {
      //       type: "string",
      //     },
      //     answerHash: {
      //       type: "string",
      //     },
      //     validatorDid: {
      //       type: "string",
      //     },
      //     executionTime: {
      //       type: "number",
      //     },
      //   },
      //   required: ["proofOfWork"],
      // },
    },

    handler: async (request, reply) => {
      const clientDid = request.headers["X-Client-Id"];
      const challengeSalt = request.headers["X-Challenge-Salt"];
      const challengeHash = request.headers["X-Challenge-Hash"];
      if (!clientDid || !challengeSalt || !challengeHash) {
        return reply.status(400).send("You are missing a required header");
      } else if (
        Array.isArray(clientDid) ||
        Array.isArray(challengeSalt) ||
        Array.isArray(challengeHash)
      ) {
        return reply
          .status(400)
          .send("You passed the same authorization header more than once");
      }

      const serverDid = await agent.didManagerGetByAlias({
        alias: DEFAULT_IDENTIFIER_SCHEMA,
      });

      const serverAnswer = await argon2id({
        password: serverDid + clientDid,
        salt: challengeSalt,
        parallelism: 1,
        iterations: 1,
        memorySize: 1000,
        hashLength: 32, // output size = 32 bytes
        outputType: "hex",
      });

      const isValid = await argon2Verify({
        password: serverDid + clientDid,
        hash: challengeHash,
      });

      console.log(
        "serverAnswer:",
        serverAnswer,
        "challengeHash:",
        challengeHash,
        "isValid",
        isValid,
      );

      if (!isValid) {
        return reply.status(401).send("Failed to verify hash");
      }
      reply.status(200);
    },
  });
}
