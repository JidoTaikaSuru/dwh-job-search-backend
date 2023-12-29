import { decode, encode } from '@ipld/dag-json';
import * as dag_json  from '@ipld/dag-json'
import * as didJWT from 'did-jwt'; 
import { FastifyInstance, FastifyReply, FastifyRequest, FastifyServerOptions } from "fastify";
import { argon2Verify } from "hash-wasm";
import { supabaseClient } from "../index.js";
import { DEFAULT_IDENTIFIER_SCHEMA, agent } from "../setup.js";
import { get_my_did, insert_into_mesh_node_registry, sign_data_jwt, verify_argon_pow } from "../utils.js";


export default  async function registerApi(
    server: FastifyInstance,
    options: FastifyServerOptions,
  ) {
    server.route({
      method: "POST",
      url: "/register",
      schema: {
        headers: {
          type: "object",
          properties: {
          },
          required: [],
        },
      },
  
      handler: async (request, reply) => {
       

        const their_did = request.headers["did"];
        console.log("🚀 ~ file: register.ts:31 ~ handler: ~ their_did:", their_did)
        if(!their_did){
            return reply.status(401).send("missing header did");
        }
        const their_endpoint = request.headers["endpoint"];
        const their_pow = request.headers["proof-of-work-result"];   //pow  related to our did 
        const their_pol = request.headers["proof-of-latency"];  //latency from our own node. 
        //const req_jwt = request.headers["req-jwt"]; 


//BOOKMARK 

        //@ts-ignore
        //const decoded_pol = didJWT.decodeJWT(their_pol); //TODO check that the jwt came from us    decoded_pol.author === mydid 
        //console.log("🚀 ~ file: register.ts:111 ~ handler: ~ decoded_pol:", decoded_pol)
        
        const check_pol = true
        if( !check_pol){
            return reply.status(401).send("access denied check proof of latency");
        }
         

        //@ts-ignore
        const correctpow=await verify_argon_pow(their_pow , their_did )
        console.log("🚀 ~ file: register.ts:51 ~ handler: ~ correctpow:", correctpow)

        if(correctpow){
            //@ts-ignore
         insert_into_mesh_node_registry(their_did,  their_endpoint)

        const timestamp = Date.now();
        const jwt_for_successful_register_from_me =  await sign_data_jwt ({ aud: their_did, iat: timestamp, name: 'Registered With 1PoW and 1PoL' } ) 
         return reply.status(200).send(jwt_for_successful_register_from_me);
        } 
        else {
            return reply.status(401).send("access denied check proof of work");
        }


       
      },
    })
  }