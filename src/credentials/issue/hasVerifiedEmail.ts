import { FastifyReply, FastifyRequest } from "fastify";
import { agent, DEFAULT_IDENTIFIER_SCHEMA } from "../../setup.js";

import { isDateInPastWeek, storeCredential, stripDidPrefix } from "../lib.js";

export const issueHasVerifiedEmailCredentialHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  // User has authenticated, they exist, issue the credential
  const { user, authData } = request;
  console.log("Issuing has verified email credential to", user);
  const identifier = await agent.didManagerGetByAlias({
    alias: DEFAULT_IDENTIFIER_SCHEMA,
  });

  if (!authData.email_confirmed_at) {
    return reply.status(400).send("Email not confirmed at all");
  } else if (!isDateInPastWeek(authData.email_confirmed_at)) {
    return reply.status(400).send("Email not confirmed in the last week");
  }

  if (!user.did) {
    return reply
      .status(400)
      .send(
        "User has no DID. Go to /playground and click didCreate to update your record",
      );
  }

  const domain = authData.email?.split("@")[1];
  const emailAliased =
    domain === "simplelogin.com" ||
    domain === "anonaddy.com" ||
    domain === "mozmail.com";

  const date = new Date();
  date.setMonth(date.getMonth() + 3);
  const verifiableCredential = await agent.createVerifiableCredential({
    credential: {
      id: `did:web:gotid.org:credential:has-verified-email:${stripDidPrefix(
        user.did,
      )}-${process.hrtime()[0] * Math.pow(10, 9) + process.hrtime()[0]}`,
      issuer: {
        id: identifier.did,
        name: "Decentralinked Issuer",
      },
      expirationDate: date,
      type: ["VerifiableCredential", "HasVerifiedEmail"],
      credentialSubject: {
        id: user.did,
        pubkey: `did:eth:${user.public_key}`, // This should be did:ethr:<the public key of the embedded wallet, or the id of the user from supabase>
        supabaseId: user.id,
        verifiedEmail: true,
        emailAliased: emailAliased,
      },
    },
    proofFormat: "jwt",
  });
  await storeCredential(verifiableCredential);
  reply.send(verifiableCredential);
};
