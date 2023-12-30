import { FastifyInstance, FastifyServerOptions } from "fastify";
import { verify_proof_of_work, verify_jwt, save_publish_data } from "../utils.js";

export default async function publishApi(
    server: FastifyInstance,
    options: FastifyServerOptions,
) {
    server.route({
        method: "POST",
        url: "/publish",
        schema: {
            headers: {
                type: "object",
                properties: {
                },
                required: [],
            },
        },

        handler: async (request, reply) => {
            const did = request.headers["did"];                   // user DID
            const jwt = request.headers["jwt"];                   // signed JDT to verify
            const proofOfWork = request.headers["proof-of-work"]; // solved proof of work challenge
            const text = request.headers["text"];                 // text to publish
            const endpoint = request.headers["endpoint"];         // user endpoint

            if (!did || !jwt || !proofOfWork || !endpoint || !text) {
                return reply.status(400).send("missing header property");
            } else if (
                Array.isArray(did) || Array.isArray(jwt) || Array.isArray(proofOfWork) || Array.isArray(text) || Array.isArray(endpoint)
            ) {
                return reply
                    .status(400)
                    .send("You passed the same header more than once");
            }

            const isProofOfWorkVerified = await verify_proof_of_work(proofOfWork, did)

            if (!isProofOfWorkVerified) {
                return reply.status(401).send("can not verify proof of work");
            }

            const isJwtVerified = (await verify_jwt(jwt)).verified

            if (!isJwtVerified) {
                return reply.status(401).send("can not verify JWT");
            }

            try {
                await save_publish_data(did, proofOfWork, jwt, text, endpoint);
            }
            catch (e) {
                reply.status(500).send("can not save data in Tier 2 DB");
            }

            return reply.status(200).send();
        },
    })
}