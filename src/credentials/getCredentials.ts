import { FastifyReply, FastifyRequest } from "fastify";
import { agent } from "../setup.js";

export const getUserCredentials = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  // Use the pubkey of the authenticated user
  const { user } = request;
  console.log("Getting credentials for", user);

  // const userVcs = await agent.dataStoreORMGetVerifiableCredentials({
  //   where: [{ column: "subject", value: [`did:eth:${user.public_key}`] }],
  // });
  const userVcs = await agent.dataStoreORMGetVerifiableCredentials({
    where: [{ column: "subject", value: [`${user.did}`] }],
  });

  reply.send(userVcs);
};
