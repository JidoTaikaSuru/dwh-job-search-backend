import { createClient } from '@supabase/supabase-js'
import * as didJWT from 'did-jwt'; //NEW WINNER  didJWT.ES256KSigner(didJWT.hexToBytes(debug_parent_privatekey))  
import { ethers } from 'ethers';
import axios from "axios";

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

const my_ethers_wallet = await ethers.Wallet.createRandom();
export const my_private_key = get_my_private_key() ?? my_ethers_wallet.privateKey;

export const debug_parent_privatekey_didJWTsigner = await didJWT.ES256KSigner(didJWT.hexToBytes(my_private_key));

const debug_parent_wallet = new ethers.Wallet(my_private_key)

const parent_pubkey = debug_parent_wallet.address;

export const debug_parent_pubkey_PKH_did = "did:pkh:eip155:1:" + parent_pubkey;

export function get_my_did() {
    return "did:pkh:eip155:1:" + env_get("my_private_key");
}

export function get_my_private_key() {
    return env_get("my_private_key");
}

export async function self_mesh_node_register() {
    let cur_ip;
    //@ts-ignore
    if (!env_get("my_endpoint")?.includes("localhost")) {
        const options = { method: 'GET', headers: { 'Content-Type': 'application/json', "User-Agent": "curl/7.64.1" } };
        let res;
        res = await (await fetch('http://ipinfo.io/', options)).json();
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

export let ENDPOINTS_PER_DID: any | null;

export async function query_default_bootstrap_servers() {
    try {
        const { data, error } = await supabase
            .from('current_endpoints_per_did')
            .select()

        if (error) {
            console.error("Error: Could not load endpoints per DID", error)
            return
        }

        ENDPOINTS_PER_DID = data;
    } catch (e) {
        console.error("Error: Could not load endpoints per DID", e)
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
                responding_jwt: respondingJwt,
            },
        ])

    console.log("🚀 ~ file: utils.ts:101 ~ register_latency_check ~ data:", data)
    console.log("🚀 ~ file: utils.ts:101 ~ register_latency_check ~ error:", error)
}

export function getRandomEndpoint() {
    try {

        //TODO pick the endpoint among the least connected
        const randomEndpointPerDid = ENDPOINTS_PER_DID[Math.floor(Math.random() * ENDPOINTS_PER_DID.length)]
        console.log("🚀 ~ file: utils.ts:143 ~ getRandomEndpoint ~ randomEndpointPerDid:", randomEndpointPerDid)
        if (randomEndpointPerDid.endpoint) {
            return randomEndpointPerDid.endpoint.endsWith('\\') ? randomEndpointPerDid.endpoint.slice(0, -1) : randomEndpointPerDid.endpoint;
        }
    }
    catch (e) {
        console.error("Can't get random endpoint:", e);
    }
}

export async function set_interval_heartbeat_check_job() {

    setInterval(async () => {
        const requestingDid = get_my_did();
        const requestingEndpoint = env_get("my_endpoint");
        const randomEndpoint = getRandomEndpoint();

        const { data } = await axios.get(
            `${randomEndpoint}/getProofOfLatency`,
            undefined);

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

        return postResult.data;
    }, 3600000);
}