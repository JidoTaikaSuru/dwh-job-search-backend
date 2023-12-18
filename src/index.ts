import cors from '@fastify/cors';
import { createClient } from '@supabase/supabase-js';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { Database } from './__generated__/supabase-types.js';
import companyRoutes from './company/index.js';
import credentialRoutes from './credentials/index.js';
import forwarding from './dataForwarding/forwarding.js';
import dataForwarding from './dataForwarding/index.js';
import requesttask from './dataForwarding/requesttask.js';
import identifierRoutes from './identifiers/index.js';
import jobListingRoutes from './job_listing/index.js';
import jobReplyRoutes from './job_reply/index.js';
import presentationRoutes from './presentation/index.js';
import proofOfWorkRoutes from './proofOfWork/index.js';
import userRoutes from './user/index.js';


export const supabaseClient = createClient<Database>(
  'https://api.gotid.org',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicG5ibnpwZm10YmJyZ2lnempxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMDA2NDM4MiwiZXhwIjoyMDE1NjQwMzgyfQ.27a4SYNhArfx-DfEypBOaz61Ywqdul1tAFQH5UFKsrg',
);



export const jwtAuthentication = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  console.log('jwtAuthentication');
  const jwt = request.headers['x-access-token'] as string;
  if (!jwt) {
    return reply.status(400).send('No JWT provided');
  }
  console.log('Getting the user behind jwt', jwt);
  const { data: authData, error: authError } =
    await supabaseClient.auth.getUser(jwt);
  if (authError) {
    return reply.status(400).send(authError);
  }
  if (!authData.user) {
    return reply.status(401).send('User not found');
  }
  console.log('User signed in as authData', authData);

  const { data: user, error: fetchError } = await supabaseClient
    .from('users')
    .select('*')
    .eq('id', `${authData.user.id}`)
    .single();
  console.log('data', user, 'error', fetchError);
  if (fetchError) {
    return reply.status(400).send(fetchError);
  }

  if (!user) {
    return reply.status(401).send('User not found');
  }
  request.authData = authData.user;
  request.user = user;
};

export const JWT_HEADER = {
  type: 'object',
  properties: {
    'x-access-token': { type: 'string' },
  },
  required: ['x-access-token'],
}
export const JWT_HEADER_SCHEMA = {
  schema: {
    headers: JWT_HEADER,
  }
}
export const JWT_HEADER_SCHEMA_AND_PREHANDLER = {
  schema: {
    headers: JWT_HEADER,
  },
  preHandler: jwtAuthentication,
}

export const init =  () => {
  const server = fastify({
    logger: true
  });
  // await server.register(cors, {
  //   origin: '*',
  // });
  // await server.register(credentialRoutes);
  // await server.register(presentationRoutes);
  // await server.register(companyRoutes);
  // await server.register(jobListingRoutes);
  // await server.register(identifierRoutes); // You can ignore these routes, see identifiers/* for details
  // await server.register(proofOfWorkRoutes);
  // await server.register(dataForwarding);
  // await server.register(forwarding);
  // await server.register(requesttask);
  // await server.register(userRoutes);
  // await server.register(jobReplyRoutes);
  server.register(cors, {
    origin: '*',
  });
  server.register(credentialRoutes);
  server.register(presentationRoutes);
  server.register(companyRoutes);
  server.register(jobListingRoutes);
  server.register(identifierRoutes); // You can ignore these routes, see identifiers/* for details
  server.register(proofOfWorkRoutes);
  server.register(dataForwarding);
  server.register(forwarding);
  server.register(requesttask);
  server.register(userRoutes);
  server.register(jobReplyRoutes);
  return server
}
//
// if (require.main === module) {
//   // called directly i.e. "node app"
//   await init().listen({ port: 8080 }, (err) => {
//     if (err) console.error(err);
//     console.log('server listening on 3000');
//   });
// } else {
//   // required as a module => executed on aws lambda
//   module.exports = init;
// }

// module.exports = init;

