// Core interfaces
import {
  createAgent,
  ICredentialPlugin,
  IDataStoreORM,
  IDIDManager,
  IKeyManager,
  IResolver,
} from "@veramo/core";

// Core identity manager plugin
import { CredentialPlugin } from "@veramo/credential-w3c";
import {
  DataStore,
  DataStoreORM,
  DIDStore,
  Entities,
  IDataStore,
  KeyStore,
  migrations,
  PrivateKeyStore,
} from "@veramo/data-store";
import { DIDManager } from "@veramo/did-manager";

// Ethr did identity provider
import { EthrDIDProvider } from "@veramo/did-provider-ethr";

// Web did identity provider
import { IonDIDProvider } from "@veramo/did-provider-ion";
import { WebDIDProvider } from "@veramo/did-provider-web";

// Core key manager plugin
import { DIDResolverPlugin } from "@veramo/did-resolver";
import { KeyManager } from "@veramo/key-manager";

// Custom key management system for RN
import { KeyManagementSystem, SecretBox } from "@veramo/kms-local";

// W3C Verifiable Credential plugin

// Custom resolvers
import { Resolver } from "did-resolver";
import dotenv from "dotenv";
import { getResolver as ethrDidResolver } from "ethr-did-resolver";
import { DataSource } from "typeorm";
import { getResolver as webDidResolver } from "web-did-resolver";
import { 
  env_get, 
  env_set, 
  check_heartbeat,
  query_default_bootstrap_servers, 
  self_mesh_node_register, 
  set_interval_heartbeat_check_job } from "./utils.js";
import { ethers } from "ethers";
// Storage plugin using TypeOrm

// TypeORM is installed with `@veramo/data-store`


dotenv.config();
export const DEFAULT_IDENTIFIER_SCHEMA = "default";
export const ION_IDENTIFIER_SCHEMA = "ion";
// This will be the name for the local sqlite database for demo purposes
// const DATABASE_FILE = "database.sqlite";

// You will need to get a project ID from infura https://www.infura.io
const INFURA_PROJECT_ID = "3586660d179141e3801c3895de1c2eba";

// This will be the secret key for the KMS
const KMS_SECRET_KEY =
  "11b574d316903ced6cc3f4787bbcc3047d9c72d1da4d83e36fe714ef785d10c1";

const dbConnection = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST || "0.0.0.0",
  database: process.env.DATABASE_NAE || "postgres",
  username: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
  synchronize: false,
  migrations,
  migrationsRun: true,
  logging: ["error", "info", "warn"],
  entities: Entities,
}).initialize();

export const agent = createAgent<
  IDIDManager &
    IKeyManager &
    IDataStore &
    IDataStoreORM &
    IResolver &
    ICredentialPlugin
>({
  plugins: [
    new KeyManager({
      store: new KeyStore(dbConnection),
      kms: {
        local: new KeyManagementSystem(
          new PrivateKeyStore(dbConnection, new SecretBox(KMS_SECRET_KEY)),
        ),
      },
    }),
    new DataStore(dbConnection),
    new DataStoreORM(dbConnection),
    new DIDManager({
      store: new DIDStore(dbConnection),
      defaultProvider: "did:ethr:goerli",
      providers: {
        "did:ethr:goerli": new EthrDIDProvider({
          defaultKms: "local",
          network: "goerli",
          rpcUrl: "https://goerli.infura.io/v3/" + INFURA_PROJECT_ID,
        }),
        "did:web": new WebDIDProvider({
          defaultKms: "local",
        }),
        "did:ion": new IonDIDProvider({
          defaultKms: "local",
        }),
      },
    }),

    new DIDResolverPlugin({
      resolver: new Resolver({
        ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
        ...webDidResolver(),
      }),
    }),
    new CredentialPlugin(),
  ],
});




// If no private key was configured by user in the enviroment variables generate a random new wallet 
if( ! env_get("my_private_key")){
  const my_ethers_wallet = await ethers.Wallet.createRandom();
  const my_private_key =  my_ethers_wallet.privateKey;
  const my_pub_key = my_ethers_wallet.address;
  env_set("my_private_key",my_private_key);
  //env_set("my_pub_key",my_pub_key);
}

await query_default_bootstrap_servers();
if( env_get("SKIP_REGISTATION") === "TRUE" ){
  console.log("Skipping registration")
}
  else{
    await self_mesh_node_register();
  }
await set_interval_heartbeat_check_job();
await check_heartbeat();

console.log("SKIP_REGISTATION="+env_get("SKIP_REGISTATION"))