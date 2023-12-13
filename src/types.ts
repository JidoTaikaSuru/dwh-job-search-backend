import { Database } from "./__generated__/supabase-types.js";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {VerifiableCredential} from "@veramo/core";

// adding jwt property to req
// authenticate property to FastifyInstance
declare module "fastify" {
  // TODO We should use generics to load these properties into specific routes/plugins
  interface FastifyRequest {
    authData: SupabaseUser;
    user: Database["public"]["Tables"]["users"]["Row"];
    vc?: VerifiableCredential;
    jobListing?: Database["public"]["Tables"]["job_listings"]["Row"];
  }

  export interface FastifyInstance {
    jwtAuthenticate: any;
  }
}


