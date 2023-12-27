import { FastifyReply, FastifyRequest } from "fastify";
import { argon2Verify } from "hash-wasm";
import { supabaseClient } from "../index.js";
import { DEFAULT_IDENTIFIER_SCHEMA, agent } from "../setup.js";

export const registerDataSubscriptionEndpoint = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {

    const clientDid = request.headers["x-client-id"];
    const answerHash = request.headers["x-answer-hash"];
    const endpoint = request.headers["x-client-endpoint"];
    const req_jwt = request.headers["req-jwt"]; //JWT from the entity trying to register... this would be better if its done by a middleware.  
    if (!clientDid || !answerHash) {
        return reply.status(400).send(`You are missing a required header`);
    } else if (
        Array.isArray(clientDid) ||
        Array.isArray(answerHash)
    ) {
        return reply
            .status(400)
            .send("You passed the same authorization header more than once");
    }



    //TODO @roman  could you change the below to check that they did the proof of work and proof of latency 
    const { did } = await agent.didManagerGetByAlias({
        alias: DEFAULT_IDENTIFIER_SCHEMA,
    });

    const isValid = await argon2Verify({
        password: did + clientDid,
        hash: answerHash,
    });

    if (!isValid) {
        return reply.status(401).send("Failed to verify hash");
    }

    //TODO ping endpoint

    const pingLatency = 300;

    /*
    const exec = util.promisify(child_process.exec);
    const { stdout, stderr } = await exec(`ping -c 1 ${endpoint}`);

    var lat = stdout.match(/("time=")\d(" ms")+/g)?.[0];
    console.log("🚀 ~ file: register.ts:44 ~ lat:", lat)
    
    var pingLatency = +stdout.substring(stdout.indexOf("time="), stdout.indexOf(" ms"));
    console.log("🚀 ~ file: register.ts:44 ~ pingLatency:", pingLatency)
*/

    if (pingLatency > 1000) {
        return reply.status(400)
            .send(`Latency check failed! Expected latency <= 1s (1000 ms). Current latency is ${pingLatency}`);
    }

    const send_data: any = {
        endpoint: endpoint,
        did: clientDid,
        last_latency: pingLatency,
    };

    const { error } = await supabaseClient.from("data_subscribers").upsert(send_data);

    if (error) {
        return reply.status(400).send(error);
    }

    return reply.status(200);
}