import { FastifyReply, FastifyRequest } from "fastify";
import { agent, DEFAULT_IDENTIFIER_SCHEMA } from "../../setup.js";
import { storeCredential, stripDidPrefix } from "../lib.js";

export const issuePassedCaptchaCredential = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  // ID for the key store, no need to change this
  const identifier = await agent.didManagerGetByAlias({
    alias: DEFAULT_IDENTIFIER_SCHEMA,
  });
  // User has already authenticated w/ JWT by the time they reach this. This means they have an account w/ us
  // User is data from the "users" table (see __generated__/supabase-types.ts, search for users: {, see the "Row" type)
  // authData is data from Supabase auth, drill into it to see the type
  const { user, authData } = request;

  console.log("Issuing passed captcha credential to", user);
  console.log("authData", authData);
  if (!user.did) {
    return reply
      .status(400)
      .send(
        "User has no DID. Go to /playground and click didCreate to update your record",
      );
  }

  /*
      TODO Do validation to make sure the user has passed the captcha right here.
  
      If they fail validation, return reply.status(400 or 401).send("message about why user faileValidation");
       */

  const date = new Date();
  date.setMonth(date.getMonth() + 3);
  const verifiableCredential = await agent.createVerifiableCredential({
    credential: {
      id: `did:web:gotid.org:credential:has-account:${stripDidPrefix(
        user.did,
      )}`,
      issuer: {
        id: identifier.did,
        name: "Decentralinked Issuer",
      },
      expirationDate: date,
      type: ["VerifiableCredential", "HasVerifiedEmail"],
      credentialSubject: {
        id: `did:eth:${user.public_key}`,
        // TODO Change the below to have the properties that a "passedCaptcha" credential should have, like "passedCaptcha: true"
        passedCaptcha: true,
      },
    },
    proofFormat: "jwt",
  });
  await storeCredential(verifiableCredential);
  reply.send(verifiableCredential);
};
