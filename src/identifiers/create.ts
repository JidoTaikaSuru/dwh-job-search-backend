import { agent, ION_IDENTIFIER_SCHEMA } from "../setup.js";
import { FastifyReply, FastifyRequest } from "fastify";

/*
Create identifier creates an identity for our internal credential issuer.
This only needs to be run once (for the hackathon) against a new DB
By the time you are reading this comment, that one run has already happened, so you can ignore this route.
 */
//TODO support specifying the alias and other identifier params
export const createIdentifier = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  // const identifier = await agent.didManagerCreate({
  //   alias: DEFAULT_IDENTIFIER_SCHEMA,
  // });
  const identifier = await agent.didManagerCreate({
    alias: ION_IDENTIFIER_SCHEMA,
    provider: "did:ion",
  });
  console.log("New identifier created", identifier);
  reply.send(identifier);
};
