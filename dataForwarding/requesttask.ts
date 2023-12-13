import { FastifyInstance, FastifyServerOptions } from "fastify";
import { agent, DEFAULT_IDENTIFIER_SCHEMA } from "../setup.js";
import { argon2id, argon2Verify, sha256, createSHA256} from "hash-wasm";

import * as jose from 'jose'
import { encode, decode } from '@ipld/dag-json'
import { CID } from 'multiformats'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import * as ethers  from  "ethers";
const keyto = require('@trust/keyto'); //this is the winner

import dotenv from "dotenv";


dotenv.config();


 
 


const trusted_pubkeys= (process.env['trustpklist']? process.env['trustpklist'] : "0xf8d34981a0258898893f516e7BB094b8433A9680,0x5aE625186BCd5749a40198Fb6a6bac7AC3CC031E,0x7a73277fa9C4F614Fe0959f27d09CaBeB28b3555").replace("0x","").split(",");
console.log("🚀 ~ file: index.ts:28 ~ trusted_pubkeys:", trusted_pubkeys)

//const debug_parent_privatekey ="680425c1f7cbb803be68aff2c841f654e3a2373920268231f99c95a954536ab9" // this fails 
const debug_parent_privatekey = process.env['parentpk']? process.env['parentpk'] : "2163b9e4411ad1df8720833b35dcf57ce44556280d9e020de2dc11752798fddd"
console.log("🚀 ~ file: index.ts:30 ~ debug_parent_privatekey:", debug_parent_privatekey)
const debug_parent_wallet =  new ethers.Wallet(debug_parent_privatekey )
const parent_pubkey = debug_parent_wallet.address; 
console.log("🚀 ~ file: index.ts:33 ~ parent_pubkey:", parent_pubkey)

const keyJwk  = keyto.from(debug_parent_privatekey, 'blk').toJwk('public');
console.log("🚀 ~ file: index.ts:28 ~ keyJwk:", keyJwk)
keyJwk.crv='secp256k1'
const parent_jwk_pubkey = await jose.importJWK(keyJwk);

// Eth keys should be fine for signing JWS and then also JWT 
const my_privatekey ="08196d9ad2196af7d481f25bd47e3a8cef48998db90360da39631d84969451d9"
const my_etherswallet =  new ethers.Wallet(my_privatekey ) //Not sure if i need the 0x   up front or if its optinoal 
const my_pubkey =my_etherswallet.address
const mykeyJwk  = keyto.from(my_privatekey, 'blk').toJwk('private');
mykeyJwk.crv='secp256k1'
const my_jwk_privatekey = await jose.importJWK(mykeyJwk);


const mykeyJwk_pub  = keyto.from(my_privatekey, 'blk').toJwk('public');
mykeyJwk_pub.crv='secp256k1'
const my_jwk_pubkey = await jose.importJWK(mykeyJwk_pub);




export default async function TakeDataRoutes(
  server: FastifyInstance,
  options: FastifyServerOptions,
) {

  server.post("/requesttask", {

    handler: async (request, reply) => {
            //todo add in PoW  verification

      if( request.body ){
 
        try{

           
         
         
        return reply.status(200).send({});
        
        }
        catch(e){
          console.log("🚀 ~ file: index.ts:104 ~ handler: ~ e:", e)
          
        }
    
    
        
      }


      return reply.status(401).send("Failed");
 
    },
  });
}
