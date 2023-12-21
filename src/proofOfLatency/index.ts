import { FastifyInstance, FastifyServerOptions } from "fastify";
import * as didJWT from 'did-jwt'; //NEW WINNER  didJWT.ES256KSigner(didJWT.hexToBytes(debug_parent_privatekey))  
import { ethers } from "ethers";
import { Resolver } from "did-resolver";
import { getResolver as pkhDidResolver } from "pkh-did-resolver";

import { getResolver as keyDIDResolver } from "key-did-resolver";

export type ProofOfLatencyHeaders = {
  "x-jwt": string;
};

const debug_parent_privatekey = process.env['debug_parent_privatekey'] ? process.env['debug_parent_privatekey'] : "2163b9e4411ad1df8720833b35dcf57ce44556280d9e020de2dc11752798fddd"
const debug_parent_privatekey_didJWTsigner = didJWT.ES256KSigner(didJWT.hexToBytes(debug_parent_privatekey))
const debug_parent_wallet = new ethers.Wallet(debug_parent_privatekey)

const parent_pubkey = debug_parent_wallet.address;

const debug_parent_pubkey_PKH_did = "did:pkh:eip155:1:" + parent_pubkey;

// latency delta in miliseconds
const deltaLatency = 1000000;

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
          "x-jwt": { type: "string" },
        },
        required: ["x-jwt"],
      },
    },

    handler: async (request, reply) => {
      const timestamp = Date.now();
      const jwt = request.headers["x-jwt"];

      if (!jwt) {
        return reply.status(400).send(`You are missing a required header`);
      } else if (
        Array.isArray(jwt)
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

      let {payload} = didJWT.decodeJWT(jwt)

      const currentLatency = timestamp - payload.latency_time_stamp_check;
      if (currentLatency > deltaLatency) {
        return reply.status(401).send(`Proof of latency failed ${currentLatency}`);
      }

      reply.status(200).send({ currentLatency });
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
