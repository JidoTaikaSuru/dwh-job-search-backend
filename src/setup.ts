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
import { DIDManager } from "@veramo/did-manager";

// Ethr did identity provider
import { EthrDIDProvider } from "@veramo/did-provider-ethr";

// Web did identity provider
import { WebDIDProvider } from "@veramo/did-provider-web";

// Core key manager plugin
import { KeyManager } from "@veramo/key-manager";

// Custom key management system for RN
import { KeyManagementSystem, SecretBox } from "@veramo/kms-local";

// W3C Verifiable Credential plugin
import { CredentialPlugin } from "@veramo/credential-w3c";

// Custom resolvers
import { DIDResolverPlugin } from "@veramo/did-resolver";
import { Resolver } from "did-resolver";
import { getResolver as ethrDidResolver } from "ethr-did-resolver";
import { getResolver as webDidResolver } from "web-did-resolver";

// Storage plugin using TypeOrm
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

// TypeORM is installed with `@veramo/data-store`
import { DataSource } from "typeorm";

import dotenv from "dotenv";
import { IonDIDProvider } from "@veramo/did-provider-ion";

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
