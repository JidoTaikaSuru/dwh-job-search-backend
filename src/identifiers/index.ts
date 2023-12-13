import { FastifyInstance, FastifyServerOptions } from "fastify";
import { jwtAuthentication } from "../index.js";
import { createIdentifier } from "./create.js";

export default async function identifierRoutes(
  server: FastifyInstance,
  options: FastifyServerOptions
) {
  server.route({
    method: "POST",
    url: "/identifier",
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
    handler: createIdentifier,
  });
}
