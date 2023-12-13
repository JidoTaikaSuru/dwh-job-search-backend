import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { createClient } from "@supabase/supabase-js";
import { Database } from "./__generated__/supabase-types.js";
import cors from "@fastify/cors";
import credentialRoutes from "./credentials/index.js";
import identifierRoutes from "./identifiers/index.js";
import presentationRoutes from "./presentation/index.js";
import jobListingRoutes from "./job_listing/index.js";
import proofOfWorkRoutes from "./proofOfWork/index.js";

const server = fastify();
export const supabaseClient = createClient<Database>(
  "https://api.gotid.org",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicG5ibnpwZm10YmJyZ2lnempxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMDA2NDM4MiwiZXhwIjoyMDE1NjQwMzgyfQ.27a4SYNhArfx-DfEypBOaz61Ywqdul1tAFQH5UFKsrg"
);

export const jwtAuthentication = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  console.log("jwtAuthentication");
  const jwt = request.headers["x-access-token"] as string;
  if (!jwt) {
    return reply.status(400).send("No JWT provided");
  }
  console.log("Getting the user behind jwt", jwt);
  const { data: authData, error: authError } =
    await supabaseClient.auth.getUser(jwt);
  if (authError) {
    return reply.status(400).send(authError);
  }
  if (!authData.user) {
    return reply.status(401).send("User not found");
  }
  console.log("User signed in as authData", authData);

  const { data: user, error: fetchError } = await supabaseClient
    .from("users")
    .select("*")
    .eq("id", `${authData.user.id}`)
    .single();
  console.log("data", user, "error", fetchError);
  if (fetchError) {
    return reply.status(400).send(fetchError);
  }

  if (!user) {
    return reply.status(401).send("User not found");
  }
  request.authData = authData.user;
  request.user = user;
};
await server.register(cors, {
  origin: "*",
});
server.register(credentialRoutes);
server.register(presentationRoutes);
server.register(jobListingRoutes);
server.register(identifierRoutes); // You can ignore these routes, see identifiers/* for details
server.register(proofOfWorkRoutes); 
server.listen(
  {
    port: 8080,
    host: "0.0.0.0",
  },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  }
);

const listeners = ["SIGINT", "SIGTERM"];
listeners.forEach((signal) => {
  process.on(signal, async () => {
    await server.close();
    process.exit(0);
  });
});
