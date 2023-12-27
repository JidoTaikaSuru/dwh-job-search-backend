
import * as dag_json  from '@ipld/dag-json'
import { createClient } from '@supabase/supabase-js'
import * as didJWT from 'did-jwt'; //NEW WINNER  didJWT.ES256KSigner(didJWT.hexToBytes(debug_parent_privatekey))  
import { ethers } from 'ethers';
import { CID } from 'multiformats'
import * as multiformats_json from 'multiformats/codecs/json'
import { sha256 } from 'multiformats/hashes/sha2'
import postgres from 'postgres'
import { neon } from '@neondatabase/serverless';
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


let tmpkey = get_my_private_key(); 
const my_ethers_wallet =  tmpkey ?    new ethers.Wallet(tmpkey): await ethers.Wallet.createRandom();
export const my_private_key =  my_ethers_wallet.privateKey;
export const my_pub_key =  my_ethers_wallet.privateKey;



export const my_privatekey_didJWTsigner = await didJWT.ES256KSigner(didJWT.hexToBytes(my_private_key));

export const debug_parent_privatekey_didJWTsigner = await didJWT.ES256KSigner(didJWT.hexToBytes(my_private_key));

const debug_parent_wallet = new ethers.Wallet(my_private_key)

const parent_pubkey = debug_parent_wallet.address;

export const debug_parent_pubkey_PKH_did = "did:pkh:eip155:1:" + parent_pubkey;

export function get_my_did() {
    return "did:pkh:eip155:1:" + env_get("my_private_key");
}

export function get_my_private_key() {
    return env_get("my_private_key")   ;
}

export async function self_mesh_node_register() {
    let cur_ip;
    //@ts-ignore
    if (!env_get("my_endpoint")?.includes("localhost")) {
        const options = { method: 'GET', headers: { 'Content-Type': 'application/json', "User-Agent": "curl/7.64.1" } };
        let  res = await (await fetch('http://ipinfo.io/', options)).json();

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


    const { data, error } = await supabase
        .from('mesh_node_registry')
        .insert([
            { did: get_my_did(), endpoint: env_get("my_endpoint"), j: cur_ip },
        ])

}

export let ENDPOINTS_PER_DID : any | null;

export let current_endpoints_per_did = {}; 
export async function query_default_bootstrap_servers() {

    try {
        const { data, error } = await supabase

            .from('current_endpoints_per_did')
            .select("did,endpoint,created_at")

            if(data && data.length > 0)
                    current_endpoints_per_did = data;

        ENDPOINTS_PER_DID = data;

        console.log("🚀 ~ file: utils.ts:86 ~ query_default_bootstrap_servers ~ data:", data)
        console.log("🚀 ~ file: utils.ts:85 ~ query_default_bootstrap_servers ~ error:", error)
    } catch (e) {
        console.log("🚀 ~ file: utils.ts:90 ~ query_default_bootstrap_servers ~ e:", e)
    }

}

export async function register_latency_check(
    did: string, latency: number, ip: string, respondingJwt: string) {
    const respondingDid = get_my_did();
    const respondingEndpoint = env_get("my_endpoint");

    const { data, error } = await supabase
        .from('heartbeat_latency_hist')
        .insert([
            {
                requesting_did: did,
                responding_did: respondingDid,
                responding_endpoint: respondingEndpoint,
                latency,
                requesting_ip: ip,
                responding_jwt : respondingJwt,
            },
        ])

        console.log("🚀 ~ file: utils.ts:101 ~ register_latency_check ~ data:", data)
        console.log("🚀 ~ file: utils.ts:101 ~ register_latency_check ~ error:", error)
}


export async function json_to_cid(data:object){

    const bytes = dag_json.encode(data)
    //const bytes = multiformats_json.encode(data)  //This codec does not order json to make it deterministic  just just ignores whitespace and simpler things
    const hash = await sha256.digest(bytes)
    const cid = CID.create(1, multiformats_json.code, hash)
        return cid.toString(); 
}


export async function sign_data_jwt(data:object){  
    const signed_data = await didJWT.createJWT(
        { ...data },
        { issuer: my_pub_key, signer: my_privatekey_didJWTsigner },
        { alg: 'ES256K' });

        return(signed_data);
}



const constr = env_get("MY_PG_DATABASE_PSQL");
//@ts-ignore
//const sql = postgres(constr,{ ssl: 'require'})
const sql  = neon(env_get("MY_PG_DATABASE_URL")!);

const testsql1 = await sql`select now();`
const testsql2 = await sql`select * from fed_data limit 1;`
console.log("🚀 ~ file: utils.ts:184 ~ testsql1:", testsql1)
console.log("🚀 ~ file: utils.ts:185 ~ testsql2:", testsql2)

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

 
export async function update_topic_sub(did:string,topics:string){
    const topiclist= topics.split(",");
   
}

export async function add_fed_data_json(data:object, cid:string,author_did:string,publisher_did:string,publisher_epoch:number,author_sig:string,publisher_sig:string){
            const sql_ret = await sql `insert into fed_data (cid,data,author_did,publisher_did,publisher_epoch,author_sig,publisher_sig) values (${cid},${JSON.stringify(data)},${author_did},${publisher_did},${publisher_epoch},${author_sig},${publisher_sig})`
            console.log("🚀 ~ file: utils.ts:188 ~ add_fed_data_json ~ sql_ret:", sql_ret)
}
           
//I'm really suprised the below works for inserting binary data... 
export async function add_fed_data_binary(data:Uint8Array, cid:string,author_did:string,publisher_did:string,publisher_epoch:number,author_sig:string,publisher_sig:string){
    const sql_ret = await sql `insert into fed_data_binary (cid,data,author_did,publisher_did,publisher_epoch,author_sig,publisher_sig) values (${cid},${data},${author_did},${publisher_did},${publisher_epoch},${author_sig},${publisher_sig})`  //TODO change this to a safe binary insertion. 
    console.log("🚀 ~ file: utils.ts:188 ~ add_fed_data_binary ~ sql_ret:", sql_ret)
}

