import { FastifyInstance, FastifyServerOptions } from "fastify";
import * as didJWT from 'did-jwt'; //NEW WINNER  didJWT.ES256KSigner(didJWT.hexToBytes(debug_parent_privatekey))  
import { Resolver } from "did-resolver";
import { getResolver as pkhDidResolver } from "pkh-did-resolver";
import { debug_parent_pubkey_PKH_did, debug_parent_privatekey_didJWTsigner, register_latency_check } from "../utils.js";

export type ProofOfLatencyHeaders = {
  "x-jwt": string;
};

// latency delta in miliseconds(?)
const deltaLatency = 100000000;

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
      const timestamp = Date.now();
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

      let resolver = new Resolver({ ...pkhDidResolver() });
      
      let verificationResponse = await didJWT.verifyJWT(jwt, {
        resolver,
        audience: debug_parent_pubkey_PKH_did
      });
      
      let isverfied = false;

      if (verificationResponse.verified) {
        isverfied = true;
      }

      if (!isverfied) {
        return reply.status(401).send("Failed to verify hash");
      }

      let { payload } = didJWT.decodeJWT(jwt)

      const currentLatency = timestamp - payload.latency_time_stamp_check;
            if (currentLatency > deltaLatency) {
        return reply.status(401).send(`Proof of latency failed ${currentLatency}`);
      }

      let respondingJwt = await didJWT.createJWT(
        {
          name: 'register latency check',
          latency_time_stamp_check: timestamp,
          result_latency: currentLatency,
          request_ip: request.ip
        },
        { issuer: debug_parent_pubkey_PKH_did, signer: debug_parent_privatekey_didJWTsigner },
        { alg: 'ES256K' });
            
      register_latency_check(did, currentLatency, request.ip, respondingJwt);

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
