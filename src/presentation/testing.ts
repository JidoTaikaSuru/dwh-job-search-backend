import { IVerifiableCredential } from "@sphereon/ssi-types";
import { PEX } from "@sphereon/pex";
import {
  hasAccountPresentationDefinition,
  precreateJobListings,
} from "../job_listing/setup.js";

const pex = new PEX();

precreateJobListings();

const credentials: IVerifiableCredential[] = [
  {
    issuer: {
      id: "did:ethr:goerli:0x03ee6b214c87fe28cb5cbc486cfb60295bb05ebd2803e98fa5a6e658e89991aa8b",
      name: "Decentralinked Issuer",
    },
    credentialSubject: {
      signinMethod: "OTP",
      id: "did:eth:null",
    },
    id: "did:web:gotid.org:credential:has-account:4b7a6302-ca53-4472-949d-cd54adf02cf8",
    type: ["VerifiableCredential", "HasAccountWithTrustAuthority"],
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    issuanceDate: "2023-11-26T01:26:04.000Z",
    expirationDate: "2024-02-26T01:26:04.000Z",
    proof: {
      type: "JwtProof2020",
      jwt: "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3MDg5MTA3NjQsInZjIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJIYXNBY2NvdW50V2l0aFRydXN0QXV0aG9yaXR5Il0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7InNpZ25pbk1ldGhvZCI6Ik9UUCJ9fSwiaXNzdWVyIjp7Im5hbWUiOiJEZWNlbnRyYWxpbmtlZCBJc3N1ZXIifSwic3ViIjoiZGlkOmV0aDpudWxsIiwianRpIjoiZGlkOndlYjpnb3RpZC5vcmc6Y3JlZGVudGlhbDpoYXMtYWNjb3VudDo0YjdhNjMwMi1jYTUzLTQ0NzItOTQ5ZC1jZDU0YWRmMDJjZjgiLCJuYmYiOjE3MDA5NjE5NjQsImlzcyI6ImRpZDpldGhyOmdvZXJsaToweDAzZWU2YjIxNGM4N2ZlMjhjYjVjYmM0ODZjZmI2MDI5NWJiMDVlYmQyODAzZTk4ZmE1YTZlNjU4ZTg5OTkxYWE4YiJ9.D8qE2VzA8quYxhYU5OST7Bcq8cqvOP9tgSFZiG1T4hJsW11zZaD7lESq6Xz6FcehVo_sbXwtHNJOmHaK51HBgw",
      proofPurpose: "assertionMethod",
      created: new Date().toLocaleString(),
      verificationMethod: "dunno",
    },
  },
  {
    issuer: {
      id: "did:ethr:goerli:0x03ee6b214c87fe28cb5cbc486cfb60295bb05ebd2803e98fa5a6e658e89991aa8b",
      name: "Decentralinked Issuer",
    },
    credentialSubject: {
      verifiedEmail: true,
      emailAliased: false,
      id: "did:eth:null",
    },
    id: "did:web:gotid.org:credential:has-verified-email:4b7a6302-ca53-4472-949d-cd54adf02cf8",
    type: ["VerifiableCredential", "HasVerifiedEmail"],
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    issuanceDate: "2023-11-26T18:24:38.000Z",
    expirationDate: "2024-02-26T18:24:38.000Z",
    proof: {
      type: "JwtProof2020",
      jwt: "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3MDg5NzE4NzgsInZjIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJIYXNWZXJpZmllZEVtYWlsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7InZlcmlmaWVkRW1haWwiOnRydWUsImVtYWlsQWxpYXNlZCI6ZmFsc2V9fSwiaXNzdWVyIjp7Im5hbWUiOiJEZWNlbnRyYWxpbmtlZCBJc3N1ZXIifSwic3ViIjoiZGlkOmV0aDpudWxsIiwianRpIjoiZGlkOndlYjpnb3RpZC5vcmc6Y3JlZGVudGlhbDpoYXMtdmVyaWZpZWQtZW1haWw6NGI3YTYzMDItY2E1My00NDcyLTk0OWQtY2Q1NGFkZjAyY2Y4IiwibmJmIjoxNzAxMDIzMDc4LCJpc3MiOiJkaWQ6ZXRocjpnb2VybGk6MHgwM2VlNmIyMTRjODdmZTI4Y2I1Y2JjNDg2Y2ZiNjAyOTViYjA1ZWJkMjgwM2U5OGZhNWE2ZTY1OGU4OTk5MWFhOGIifQ.wG-NI56e3JxLLBuHU5qj9DDI_5mZimXGNr2PqqAUx_haHBLrH7A4TbKC6Wvh0_JSpJuOAcNaBybj3k2UaTLTQA",
      proofPurpose: "assertionMethod",
      created: new Date().toLocaleString(),
      verificationMethod: "dunno",
    },
  },
];
console.log(JSON.stringify(credentials, null, 2));

const srMatches = pex.selectFrom(
  hasAccountPresentationDefinition,
  credentials,
  { holderDIDs: ["did:eth:null"] },
);

console.log(srMatches);
