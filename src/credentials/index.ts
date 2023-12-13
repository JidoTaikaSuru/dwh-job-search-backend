import { FastifyInstance, FastifyServerOptions } from "fastify";
import { jwtAuthentication } from "../index.js";
import { issueHasAccountCredentialHandler } from "./issue/hasAccount.js";
import { getUserCredentials } from "./getCredentials.js";
import { issueHasVerifiedEmailCredentialHandler } from "./issue/hasVerifiedEmail.js";
import { issuePassedCaptchaCredential } from "./issue/passedCaptcha.js";

export default async function credentialRoutes(
  server: FastifyInstance,
  options: FastifyServerOptions
) {
  server.route({
    method: "POST",
    url: "/credentials/issue/has-account",
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
    handler: issueHasAccountCredentialHandler,
  });
  server.route({
    method: "POST",
    url: "/credentials/issue/has-verified-email",
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
    handler: issueHasVerifiedEmailCredentialHandler,
  });
  server.route({
    method: "POST",
    url: "/credentials/issue/passed-captcha",
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
    handler: issuePassedCaptchaCredential,
  });
  server.route({
    method: "GET",
    url: "/credentials",
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
    handler: getUserCredentials,
  });
}
