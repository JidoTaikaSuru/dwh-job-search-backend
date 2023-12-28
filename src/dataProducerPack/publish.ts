
import { decode, encode } from '@ipld/dag-json';
import * as dag_json  from '@ipld/dag-json'
import * as didJWT from 'did-jwt'; //NEW WINNER  didJWT.ES256KSigner(didJWT.hexToBytes(debug_parent_privatekey))  
import { Resolver } from "did-resolver";
import { FastifyReply, FastifyRequest , FastifyServerOptions , FastifyInstance  } from 'fastify';
import { CID } from 'multiformats/cid'
import * as json from 'multiformats/codecs/json'
import { sha256 } from 'multiformats/hashes/sha2'
import { getResolver as pkhDidResolver } from "pkh-did-resolver";
import postgres from 'postgres'
import { debug_parent_pubkey_PKH_did, debug_parent_privatekey_didJWTsigner, register_latency_check, env_get, json_to_cid, add_fed_data_json, add_fed_data_binary, sign_data_jwt } from "../utils.js";

 

 
  export  async function publish(
    server: FastifyInstance,
    options: FastifyServerOptions,
  ) {
    server.route({
      method: "POST",
      url: "/publish",
      schema: {
        headers: {
          type: "object",
          properties: {
          },
          required: [],
        },
      },
  
      handler: async (request, reply) => {


        const topic =  request.headers['topic']
        const cid =  request.headers['cid']
        const author_did =  request.headers['author_did']
        const publisher_did =  request.headers['publisher_did'] //could be renamed  app did   and should be optional 
        const author_sig =  request.headers['author_sig']
        const publisher_sig =  request.headers['publisher_sig']  //could be renamed  app sig  and should be optional . If provided and the app is in good standing then google recaptcha and email verifcation are not required. 
        const publisher_epoch =  request.headers['publisher_epoch']

        //TODO verify publisher sig 
        //TODO verify author sig

        //TODO add google reCaptcah 
        //TODO add cloudflare turnstile 
        //TODO add IP address based rate limiting 
        //TODO checko email verification 

        //I don't want to use proof of work check here b/c even verifying the proof of work is work 
      


       console.log("🚀 ~ file: acceptData.ts:81 ~ handler: ~ typeof request.body:", typeof request.body)
       if( request.body && typeof request.body === 'object'){
        const data = request.body;

          const cid_re= await json_to_cid(data)
          const bytes = dag_json.encode(data)
          if(cid!==cid_re )
            reply.status(403).send("Provided CID does not match our calcualted cid "+cid+" vs "+cid_re);
          else{

            try{
               
                //TODO nominate a random Subscriber to be the broadcaster   (for now I will use the supabase table but this should be changed soon)
                
              
              return reply.status(200).send({cid:cid_re }) 

            }
            catch(e){
              console.log("🚀 ~ file: acceptData.ts:64 ~ handler: ~ e:", e)

              
              return reply.status(500).send({"cid":cid_re, "error":e});
            }
            //console.log("🚀 ~ file: acceptData.ts:64 ~ handler: ~ ret_insert2:", ret_insert2)
 
      
          
          }


          return reply.status(200).send("cid_re:"+cid_re);
       }

       return reply.status(200).send("rwo2");
      },
    })
  }



export  async function rwoRoute(
    server: FastifyInstance,
    options: FastifyServerOptions,
  ) {
    server.route({
      method: "POST",
      url: "/rwo",
      schema: {
        headers: {
          type: "object",
          properties: {
          },
          required: [],
        },
      },
  
      handler: async (request, reply) => {
       
        return reply.status(200).send("rwo2");
      },
    })
  }
  
 