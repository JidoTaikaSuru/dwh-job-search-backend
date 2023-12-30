import * as dag_json from '@ipld/dag-json'
import { createClient } from '@supabase/supabase-js'
import axios from "axios";
import * as didJWT from 'did-jwt'; //NEW WINNER  didJWT.ES256KSigner(didJWT.hexToBytes(debug_parent_privatekey))  
import { ethers } from 'ethers';
import { argon2Verify } from "hash-wasm";
import { CID } from 'multiformats'
import * as multiformats_json from 'multiformats/codecs/json'
import { sha256 } from 'multiformats/hashes/sha2'
import postgres from 'postgres'
import { do_proofOfWork } from './proofOfWork/index.js';
import { getResolver as pkhDidResolver } from "pkh-did-resolver";
import { Resolver } from "did-resolver";



//import { neon } from '@neondatabase/serverless';


/*
let js_runtime = "node";
export function utils_init(){
    if (Deno &&  Deno.env) {
        js_runtime="deno";
      }
    if( env && env.name ){
        js_runtime="cloudflare";
    } 
}

export function set_js_runtime(arg_js_runtime:string){
    js_runtime=arg_js_runtime;
}

*/
export function env_get(key: string): string | undefined {
    return process.env[key];
    /*
    if(js_runtime === "node" ){
        return process.env[key];
    }
    else if (js_runtime === "deno"){
        return Deno.env.get(key);
    }
    else if (js_runtime === "cloudflare"){
        return env[key];
    }
    */
}

export function env_set(key: string, value: string) {
    return process.env[key] = value;
}

const DATABASE_HOST = "https://ubpnbnzpfmtbbrgigzjq.supabase.co";
const anonkey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicG5ibnpwZm10YmJyZ2lnempxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwNjQzODIsImV4cCI6MjAxNTY0MDM4Mn0.fS_FBY4mDgYVn1GDocKMuze5y_s_ZlX5acQ-QAVcvG0"
const supabase = await createClient(DATABASE_HOST, anonkey)


export function get_my_private_key() {
    return env_get("my_private_key");
}


let tmpkey = get_my_private_key();
const my_ethers_wallet = tmpkey ? new ethers.Wallet(tmpkey) : await ethers.Wallet.createRandom();
export const my_private_key = my_ethers_wallet.privateKey;
export const my_pub_key = my_ethers_wallet.address;

export function get_my_did() {
    return "did:pkh:eip155:1:" + my_pub_key;
}


export const my_privatekey_didJWTsigner = await didJWT.ES256KSigner(didJWT.hexToBytes(my_private_key));

export const debug_parent_privatekey_didJWTsigner = await didJWT.ES256KSigner(didJWT.hexToBytes(my_private_key));

const debug_parent_wallet = new ethers.Wallet(my_private_key)

const parent_pubkey = debug_parent_wallet.address; // todo remove 

export const debug_parent_pubkey_PKH_did = "did:pkh:eip155:1:" + parent_pubkey;

export let CURRENT_TIER1_REGISTRATION_JWT="";


export async function self_mesh_node_register() {
    let cur_ip;
    //@ts-ignore
    if (!env_get("my_endpoint")?.includes("localhost")) {
        const options = { method: 'GET', headers: { 'Content-Type': 'application/json', "User-Agent": "curl/7.64.1" } };
        let res = await (await fetch('http://ipinfo.io/', options)).json();

        //@ts-ignore
        if (!res || res?.ip) {

            res = await (await fetch('http://ifconfig.me/all.json', options)).json();
            //@ts-ignore
            if (res.ip_addr) {
                //@ts-ignore
                res.ip = res.ip_addr;
            }
        }

        //@ts-ignore
        if (res && res.ip)
            cur_ip = res;

    }

  
    
    //bookmark


    //    const their_pol = request.headers["proof-of-latency"];  //latency from our own node. 


    try{

        /*
    const postResult = await axios.post(
        `${env_get('target_parent_tier1_endpoint')}/register`,
        {},
        {
            headers: {
                "endpoint": env_get("my_endpoint"),
                "proof-of-work-result": env_get("POW_ANSWER"),
                "did": get_my_did(),
                "Content-Type": "application/json"
            },
        });
    console.log("🚀 ~ file: utils.ts:126 ~ self_mesh_node_register ~ postResult:", postResult)
    */

    
    const options = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          'endpoint': env_get("my_endpoint"),
          'proof-of-work-result': env_get("POW_ANSWER"),
          'proof-of-latency': 'asdasd',
          'did':get_my_did()
        },
        body: '{"a":"a"}'
      };
      
      const res = await fetch(env_get("target_parent_tier1_endpoint")+"/register", options)
      //TODO save this to global variable and start using this JWT in all communication with Tier1 node.
      const res_text = await res.text();
      if( res.status==200 && res_text  && res_text.length >0){
        CURRENT_TIER1_REGISTRATION_JWT=res_text;
        console.log("🚀 ~ file: utils.ts:145 ~ self_mesh_node_register ~ res_text:", res_text) 
      }
    
      console.log("🚀 ~ file: utils.ts:130 ~ self_mesh_node_register ~ res.statusText:", res.statusText)
      console.log("🚀 ~ file: utils.ts:130 ~ self_mesh_node_register ~ res.status:", res.status)
   


    }
    catch(e){
        console.log("🚀 ~ file: utils.ts:130 ~ self_mesh_node_register ~ e:", e)
        console.log("🚀 ~ file: utils.ts:130 ~ self_mesh_node_register ~ e.cause.errors:", e.cause.errors)
    }
    //consol

    //TODO remove this
    const { data, error } = await supabase
        .from('mesh_node_registry')
        .insert([
            { did: get_my_did(), endpoint: env_get("my_endpoint"), j: cur_ip },
        ])

}

export let ENDPOINTS_PER_DID: any | null;

export let current_endpoints_per_did = {};
export async function query_default_bootstrap_servers() {
    try {
        const { data, error } = await supabase
            .from('current_endpoints_per_did')
            .select("did,endpoint,created_at")

        if (data && data.length > 0)
            current_endpoints_per_did = data;

        if (error) {
            console.error("Error: Could not load endpoints per DID", error)
            return
        }

        ENDPOINTS_PER_DID = data;
    } catch (e) {
        console.error("Error: Could not load endpoints per DID", e)
    }
}

export async function verify_proof_of_latency(jwt: string) {
    const timestamp = Date.now();

    // latency delta in miliseconds(?)
    //TODO move to .env or config
    const deltaLatency = 100000000;

    let resolver = new Resolver({ ...pkhDidResolver() });
  
    let verificationResponse = await didJWT.verifyJWT(jwt, {
      resolver,
      audience: debug_parent_pubkey_PKH_did
    });
  
    let isverfied = false;
  
    if (verificationResponse.verified) {
      isverfied = true;
    }
  
    if (!isverfied) {
      return { error: "Failed to verify hash" };
    }
  
    let { payload } = didJWT.decodeJWT(jwt)
  
    const latency = timestamp - payload.latency_time_stamp_check;
    if (latency > deltaLatency) {
      return { latency, error: `Proof of latency failed ${latency}` };
    }
  
    let respondingJwt = await didJWT.createJWT(
      {
        name: 'register latency check',
        latency_time_stamp_check: timestamp,
        result_latency: latency,
        request_ip: jwt
      },
      { issuer: debug_parent_pubkey_PKH_did, signer: debug_parent_privatekey_didJWTsigner },
      { alg: 'ES256K' });
  
    return { respondingJwt, latency, error: `Proof of latency failed ${latency}` };
  }

export async function register_latency_check(
    did: string, latency: number, ip: string, respondingJwt: string, requestingEndpoint: string) {
    console.log("🚀 ~ file: utils.ts:135 ~ register_latency_check:", register_latency_check)
    const respondingDid = get_my_did();
    const respondingEndpoint = env_get("my_endpoint");

    /*  const { data, error } = await supabase
         .from('heartbeat_latency_hist')
         .insert([
             {
                 requesting_did: did,
                 responding_did: respondingDid,
                 responding_endpoint: respondingEndpoint,
                 latency,
                 requesting_ip: ip,
                 responding_jwt: respondingJwt,
             },
         ]) */

    const data = await sql`INSERT INTO heartbeat_latency_hist(
        requesting_did,
        responding_did,
        responding_endpoint,
        requesting_endpoint,
        latency,
        requesting_ip,
        responding_jwt
        )
        values (
        ${did},${respondingDid},${respondingEndpoint},${requestingEndpoint},${latency},${ip},${respondingJwt}
        )
        `;

    console.log("🚀 ~ file: utils.ts:101 ~ register_latency_check ~ data:", data)
}


export async function json_to_cid(data: object) {

    const bytes = dag_json.encode(data)
    //const bytes = multiformats_json.encode(data)  //This codec does not order json to make it deterministic  just just ignores whitespace and simpler things
    const hash = await sha256.digest(bytes)
    const cid = CID.create(1, multiformats_json.code, hash)
    return cid.toString();
}


export async function sign_data_jwt(data: object) {
    const signed_data = await didJWT.createJWT(
        { ...data },
        { issuer: my_pub_key, signer: my_privatekey_didJWTsigner },
        { alg: 'ES256K' });

    return (signed_data);
}



const constr = env_get("MY_PG_DATABASE_PSQL");
//@ts-ignore
const sql = postgres(constr,{ ssl: 'require'})
//const sql = neon(env_get("MY_PG_DATABASE_URL")!);

const testsql1 = await sql`select now();`

console.log("🚀 ~ file: utils.ts:184 ~ testsql1:", testsql1)


const heartbeat_latency_hist_tbl = await sql`create table  IF NOT EXISTS heartbeat_latency_hist (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    requesting_did text null,
    responding_did text null,
    requesting_endpoint text null,
    responding_endpoint text null,
    latency bigint null,
    responding_jwt text null,
    requesting_jwt text null,
    j jsonb null,
    requesting_ip text null,
    responding_ip text null,
    constraint heartbeat_latency_hist_pkey primary key (id)
  ) ;
`
console.log("🚀 ~ file: utils.ts:196 ~ mesh_node_registry_tbl:", heartbeat_latency_hist_tbl)


const mesh_node_registry_tbl = await sql`create table  IF NOT EXISTS mesh_node_registry (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    did text null,
    endpoint text null,
    j jsonb null,
    constraint mesh_node_registry_pkey primary key (id)
  ) ;
`
console.log("🚀 ~ file: utils.ts:196 ~ mesh_node_registry_tbl:", mesh_node_registry_tbl)

const fed_data_able = await sql` create table IF NOT EXISTS fed_data (
    cid text not null,
    data json not null,
    author_did text not null,
    publisher_did text not null,
    publisher_epoch bigint null,
    author_sig text null,
    publisher_sig text null,
    db_created_at timestamp with time zone not null default now(),
    constraint fed_data_pkey primary key (cid)
  ) tablespace pg_default;
`


const fed_data_binary_table = await sql` create table IF NOT EXISTS fed_data_binary (
    cid text not null,
    data bytea not null,
    author_did text not null,
    publisher_did text not null,
    publisher_epoch bigint null,
    author_sig text null,
    publisher_sig text null,
    db_created_at timestamp with time zone not null default now(),
    constraint fed_data_pkey2 primary key (cid)
  ) tablespace pg_default;
`

const sub_registry_table = await sql` create table  IF NOT EXISTS sub_registry (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    did text null,
    endpoint text null,
    topics text null,
    last_been_broadcaster timestamp with time zone null,
    j jsonb null,
    constraint sub_registry_pkey primary key (did)
  ) ;
`  //topis is a comma seperated list of topics 


const sub_topic_registry_table = await sql`  create table  IF NOT EXISTS public.sub_topic_registry (
    dids text ,
    topic text ,
    endpoint text null,
    j jsonb null,
    constraint sub_topic_registry_pkey primary key (topic)
  ) ;
` //A list of dids comma seperated 


export async function update_topic_sub(did: string, topics: string) {
    const topiclist = topics.split(",");

}

export async function add_fed_data_json(data: object, cid: string, author_did: string, publisher_did: string, publisher_epoch: number, author_sig: string, publisher_sig: string) {
    const sql_ret = await sql`insert into fed_data (cid,data,author_did,publisher_did,publisher_epoch,author_sig,publisher_sig) values (${cid},${JSON.stringify(data)},${author_did},${publisher_did},${publisher_epoch},${author_sig},${publisher_sig})`
    console.log("🚀 ~ file: utils.ts:188 ~ add_fed_data_json ~ sql_ret:", sql_ret)
}

//I'm really suprised the below works for inserting binary data... 
export async function add_fed_data_binary(data: Uint8Array, cid: string, author_did: string, publisher_did: string, publisher_epoch: number, author_sig: string, publisher_sig: string) {
    const sql_ret = await sql`insert into fed_data_binary (cid,data,author_did,publisher_did,publisher_epoch,author_sig,publisher_sig) values (${cid},${data},${author_did},${publisher_did},${publisher_epoch},${author_sig},${publisher_sig})`  //TODO change this to a safe binary insertion. 
    console.log("🚀 ~ file: utils.ts:188 ~ add_fed_data_binary ~ sql_ret:", sql_ret)
}

export async function insert_into_mesh_node_registry(did: string, endpoint: string ) {
    const sql_ret = await sql`insert into mesh_node_registry (did, endpoint) values (${did}, ${endpoint})`  
    console.log("🚀 ~ file: utils.ts:303 ~ insert_into_mesh_node_registry ~ sql_ret:", sql_ret)
}
   

async function getRandomEndpoint() {
    try {
        //const checkedEndpoints = await sql`SELECT * FROM heartbeat_latency_hist WHERE requesting_did =${get_my_did()} ORDER BY created_at`

        //const randomEndpointPerDid = endpointsToCheckWith[Math.floor(Math.random() * endpointsToCheckWith.length)]
        const randomEndpointPerDid = ENDPOINTS_PER_DID[Math.floor(Math.random() * ENDPOINTS_PER_DID.length)]

        if (randomEndpointPerDid.endpoint) {
            return randomEndpointPerDid.endpoint.endsWith('/') 
            ? randomEndpointPerDid.endpoint.slice(0, -1) 
            : randomEndpointPerDid.endpoint;
        }
    }
    catch (e) {
        console.error("Can't get random endpoint:", e);
    }
}

export async function set_interval_heartbeat_check_job() {

    setInterval(async () => {
        check_heartbeat()
    }, 3600000);
}

export async function check_heartbeat() {

    const requestingDid = get_my_did();
    const requestingEndpoint = env_get("my_endpoint");
    const randomEndpoint = await getRandomEndpoint();

    if (!randomEndpoint) {
        console.error("Can't get random endpoint to check heartbeat");
        return
    }

    const { data } = await axios.get(
        `${randomEndpoint}/getProofOfLatency`,
        undefined);
    console.log("🚀 ~ file: utils.ts:341 ~ check_heartbeat ~ data:", data)

    const postResult = await axios.post(
        `${randomEndpoint}/postProofOfLatency`,
        {},
        {
            headers: {
                "x-did": requestingDid,
                "x-jwt": data.jwt,
                "x-endpoint": requestingEndpoint,
                "Content-Type": "application/json"
            },
        });
    //console.log("🚀 ~ file: utils.ts:354 ~ check_heartbeat ~ postResult:", postResult)  //todo change to try catch and get proper errorm essage instead of whole object printed 

    return postResult.data;
}



export async  function  verify_argon_pow(answerHash:string,their_did:string){ //TODO make the number of 00000 variable 
    console.log("🚀 ~ file: utils.ts:418 ~ verify_argon_pow ~ input  "+  their_did+" "+get_my_did())
    const lastPart = answerHash.substring(answerHash.lastIndexOf('$') + 1, answerHash.length);
    const answerHex = Buffer.from(lastPart, 'base64').toString('hex');
    console.log("🚀 ~ file: utils.ts:121 ~ self_mesh_node_register ~ answerHex:", answerHex)

    if( (answerHex.match(/0000/g) || []).length > 0) {
    
    const isValid = await argon2Verify({
      password: get_my_did()+their_did,
      hash: answerHash,
    });
    console.log("🚀 ~ file: utils.ts:428 ~ verify_argon_pow ~ isValid:", isValid)
    return isValid;
    }
    else 
        return false;
  }



if( env_get("target_parent_tier1_endpoint").substring(0,4)!== "http"){
    env_set("target_parent_tier1_endpoint","https://"+env_get("target_parent_tier1_endpoint"))
    console.log(" automatically prepended https://  to your Tier1 endpoint b/c it was missing. it is now target_parent_tier1_endpoint= "+env_get("target_parent_tier1_endpoint"))
    //TODO do a check that https is working on the node 
}



if( env_get("my_endpoint").substring(0,4)!== "http"){
    env_set("my_endpoint","https://"+env_get("my_endpoint"))
    console.log(" automatically prepended https://  to your Self endpoint b/c it was missing. it is now  my_endpoint= "+env_get("my_endpoint"))
    //TODO do a check that https is working on the node 
}



if(!env_get("POW_ANSWER")){  



    const target_parent_tier1_endpoint = env_get('target_parent_tier1_endpoint');
    const target_parent_tier1_did = env_get('target_parent_tier1_did');
    console.log("🚀 ~ file: utils.ts:113 ~ self_mesh_node_register ~ pow inputs:"+ target_parent_tier1_did+" "+get_my_did() )

    const {answerHash}= await do_proofOfWork(target_parent_tier1_did,get_my_did() )  
    console.log("🚀 ~ file: utils.ts:115 ~ self_mesh_node_register ~ answerHash:", answerHash)


    const lastPart = answerHash.substring(answerHash.lastIndexOf('$') + 1, answerHash.length);
    const answerHex = Buffer.from(lastPart, 'base64').toString('hex');
    console.log("🚀 ~ file: utils.ts:121 ~ self_mesh_node_register ~ answerHex:", answerHex)


    const isValid = await argon2Verify({
        password: target_parent_tier1_did + get_my_did(),
        hash: answerHash,
      });
    console.log("🚀 ~ file: utils.ts:122 ~ self_mesh_node_register ~ isValid:", isValid)

    env_set("POW_ANSWER",answerHash)
}
 
  

console.log(" env var POW_ANSWER: " +  env_get("POW_ANSWER"));
console.log("Server my_did: " +  get_my_did());

//await self_mesh_node_register()