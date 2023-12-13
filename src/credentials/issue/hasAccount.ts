import { FastifyReply, FastifyRequest } from "fastify";
import { agent, DEFAULT_IDENTIFIER_SCHEMA } from "../../setup.js";

import { storeCredential, stripDidPrefix } from "../lib.js";

export const issueHasAccountCredentialHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  // User has authenticated, they exist, issue the credential
  const { user } = request;
  console.log("Issuing has account credential to", user);
  const identifier = await agent.didManagerGetByAlias({
    alias: DEFAULT_IDENTIFIER_SCHEMA,
  });
  console.log("identifier", identifier);
  const date = new Date();
  date.setMonth(date.getMonth() + 3);

  if (!user.did) {
    return reply
      .status(400)
      .send(
        `User (id: ${user.id}) has no DID. Go to /playground and click didCreate to update your record`,
      );
  }

  const verifiableCredential = await agent.createVerifiableCredential({
    credential: {
      id: `did:web:gotid.org:credential:has-account:${stripDidPrefix(
        user.did,
      )}-${process.hrtime()[0] * Math.pow(10, 9) + process.hrtime()[0]}`,
      issuer: {
        id: identifier.did,
        name: "Decentralinked Issuer",
      },
      expirationDate: date.toLocaleString(),
      type: ["VerifiableCredential", "HasAccountWithTrustAuthority"],
      credentialSubject: {
        id: user.did,
        pubkey: `did:eth:${user.public_key}`, // This should be did:ethr:<the public key of the embedded wallet, or the id of the user from supabase>
        supabaseId: user.id,
      },
    },
    proofFormat: "jwt",
    proofPurpose: "assertionMethod",
    // removeOriginalFields: false,
  });
  await storeCredential(verifiableCredential);
  reply.send(verifiableCredential);
};
