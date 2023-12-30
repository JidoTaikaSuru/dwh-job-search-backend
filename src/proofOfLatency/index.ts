import * as didJWT from 'did-jwt'; //NEW WINNER  didJWT.ES256KSigner(didJWT.hexToBytes(debug_parent_privatekey))  
import { FastifyInstance, FastifyServerOptions } from "fastify";
import { debug_parent_pubkey_PKH_did, debug_parent_privatekey_didJWTsigner, register_latency_check, verify_proof_of_latency } from "../utils.js";

export type ProofOfLatencyHeaders = {
  "x-jwt": string;
};

export default async function proofOfLatencyRoutes(
  server: FastifyInstance,
  options: FastifyServerOptions,
) {
  server.route({
    method: "POST",
    url: "/postProofOfLatency",
    schema: {
      headers: {
        type: "object",
        properties: {
          "x-did": { type: "string" },
          "x-jwt": { type: "string" },
          "x-endpoint": { type: "string" },
        },
        required: ["x-jwt", "x-did", "x-endpoint"],
      },
    },

    handler: async (request, reply) => {
      const jwt = request.headers["x-jwt"];
      const did = request.headers["x-did"];
      const endpoint = request.headers["x-endpoint"];

      if (!jwt || !did || !endpoint) {
        return reply.status(400).send(`You are missing a required header`);
      } else if (
        Array.isArray(jwt) || Array.isArray(did) || Array.isArray(endpoint)
      ) {
        return reply
          .status(400)
          .send("You passed the same authorization header more than once");
      }

      const { latency, error, respondingJwt } = await verify_proof_of_latency(jwt)

      if (!latency || error) {
        return reply
          .status(401)
          .send(error);
      }

      register_latency_check(did, latency, request.ip, respondingJwt, endpoint);

      reply.status(200).send();
    },
  }),

    server.route({
      method: "GET",
      url: "/getProofOfLatency",

      handler: async (request, reply) => {
        const timestamp = Date.now();

        let didJWTjwt_fromparent = await didJWT.createJWT(
          { aud: debug_parent_pubkey_PKH_did, iat: undefined, name: 'example parent forever access jwt', latency_time_stamp_check: timestamp },
          { issuer: debug_parent_pubkey_PKH_did, signer: debug_parent_privatekey_didJWTsigner },
          { alg: 'ES256K' });

        return reply.status(200).send({ jwt: didJWTjwt_fromparent });
      },
    });
}

