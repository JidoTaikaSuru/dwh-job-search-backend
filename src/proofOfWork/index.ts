import { FastifyInstance, FastifyServerOptions } from "fastify";
import { argon2Verify, argon2id } from "hash-wasm";
import { agent, DEFAULT_IDENTIFIER_SCHEMA } from "../setup.js";
import { Buffer } from 'node:buffer';

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
      const challengeHash = request.headers["x-challenge-hash"];
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

        return reply.status(200).send({ serverDid: did });
      },
    });
}




export const do_proofOfWork = async (
  validatorDid: string,
  myDid: string,
): Promise<{ answerHash: string }> => {
  const randomHexString = () => {
    let size = Math.floor(Math.random() * Math.floor(500));
    size = size >= 16 ? size : 16;
    const randomString = [...Array(size)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('');
    return Buffer.from(randomString).toString('hex');
  };

  let answerHash = '';

  const startTime = Date.now();
  let iteration = 0;
  do {
    answerHash = await argon2id({
      password: validatorDid + myDid,
      salt: randomHexString(),
      parallelism: 2,
      iterations: 1,
      memorySize: 1000,
      hashLength: 32, // output size = 32 bytes
      outputType: 'encoded',
    });

    const lastPart = answerHash.substring(answerHash.lastIndexOf('$') + 1, answerHash.length);

    const answerHex = Buffer.from(lastPart, 'base64').toString('hex');

    if ((answerHex.match(/00000/g) || []).length > 0) {
      
      console.log("🚀 ~ file: do Proof OF work  success after iteration:", iteration)
      return { answerHash };
    }
    iteration++;
  } while (Date.now() - startTime < 500000);

  throw new Error('Time Out ~ proofOfWork ~ ');
};