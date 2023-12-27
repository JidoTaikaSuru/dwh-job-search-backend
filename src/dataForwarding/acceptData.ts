
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


/*
const sql = postgres({
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABSE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: 'require',
})
*/


//console.log("🚀 ~ file: acceptData.ts:29 ~ mesh_node_registry_tbl:", mesh_node_registry_tbl)


  export  async function acceptData(
    server: FastifyInstance,
    options: FastifyServerOptions,
  ) {
    server.route({
      method: "POST",
      url: "/acceptData",
      schema: {
        headers: {
          type: "object",
          properties: {
          },
          required: [],
        },
      },
  
      handler: async (request, reply) => {

        const cid =  request.headers['cid']
        const author_did =  request.headers['author_did']
        const publisher_did =  request.headers['publisher_did']
        const author_sig =  request.headers['author_sig']
        const publisher_sig =  request.headers['publisher_sig']
        const publisher_epoch =  request.headers['publisher_epoch']
        const auth_jwt =  request.headers['auth_jwt']
        console.log("🚀 ~ file: acceptData.ts:52 ~ handler: ~ publisher_epoch:", publisher_epoch)
        
        if(auth_jwt){
          //@ts-ignore
          const decoded_auth_jwt = didJWT.decodeJWT(auth_jwt);
          console.log("🚀 ~ file: acceptData.ts:58 ~ handler: ~ decoded_auth_jwt:", decoded_auth_jwt)
          //TODO add jwt verification that could be from any of our trusted parents.   Get trusted parties from utils.ts current_endpoints_per_did 
        }
        //TODO verify publisher sig 
        //TODO verify author sig

        console.log("🚀 ~ file: acceptData.ts:81 ~ handler: ~ typeof request.body:", typeof request.body)
       if( request.body && typeof request.body === 'object'){
        const data = request.body;

          const cid_re= await json_to_cid(data)
          const bytes = dag_json.encode(data)
          if(cid!==cid_re )
            reply.status(403).send("Provided CID does not match our calcualted cid "+cid+" vs "+cid_re);
          else{

            try{
              
            //@ts-ignore
            const ret_insert2 = await add_fed_data_binary(bytes,cid, author_did, publisher_did, publisher_epoch, author_sig, publisher_sig )

            //@ts-ignore
            const ret_insert = await add_fed_data_json(data,cid, author_did, publisher_did, publisher_epoch, author_sig, publisher_sig )

              const confirmation = await sign_data_jwt({cid:cid_re , status:"stored" })
              console.log("🚀 ~ file: acceptData.ts:76 ~ handler: ~ confirmation:", confirmation)
              
              return reply.status(200).send({cid:cid_re, sig:confirmation}) 
              //TODO maybe add the DID of the broadcaster here. Else if the publisher sends out the same data twice it could be reused. 
            }
            catch(e){
              console.log("🚀 ~ file: acceptData.ts:64 ~ handler: ~ e:", e)

              //@ts-ignore
              if(  e.toString().includes(" duplicate key" ) ){
                return reply.status(403).send({"cid":cid_re, "error":"Duplicate key insert"});
               
              }
              else
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
  
 