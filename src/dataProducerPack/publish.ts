import * as dag_json from '@ipld/dag-json';
import { FastifyInstance, FastifyServerOptions } from 'fastify';
import { json_to_cid } from '../utils.js';


export async function publish(
  server: FastifyInstance,
  options: FastifyServerOptions,
) {
  server.route({
    method: 'POST',
    url: '/publish',
    schema: {
      headers: {
        type: 'object',
        properties: {},
        required: [],
      },
    },

    handler: async (request, reply) => {


      const topic = request.headers['topic'];
      const cid = request.headers['cid'];
      const author_did = request.headers['author_did'];
      const publisher_did = request.headers['publisher_did']; //could be renamed  app did   and should be optional
      const author_sig = request.headers['author_sig'];
      const publisher_sig = request.headers['publisher_sig'];  //could be renamed  app sig  and should be optional . If provided and the app is in good standing then google recaptcha and email verifcation are not required.
      const publisher_epoch = request.headers['publisher_epoch'];

      //TODO verify publisher sig
      //TODO verify author sig

      //TODO add google reCaptcah
      //TODO add cloudflare turnstile
      //TODO add IP address based rate limiting
      //TODO checko email verification

      //I don't want to use proof of work check here b/c even verifying the proof of work is work


      console.log('🚀 ~ file: acceptData.ts:81 ~ handler: ~ typeof request.body:', typeof request.body);
      if (request.body && typeof request.body === 'object') {
        const data = request.body;

        const cid_re = await json_to_cid(data);
        const bytes = dag_json.encode(data);
        if (cid !== cid_re)
          reply.status(403).send('Provided CID does not match our calcualted cid ' + cid + ' vs ' + cid_re);
        else {

          try {

            //TODO nominate a random Subscriber to be the broadcaster   (for now I will use the supabase table but this should be changed soon)


            return reply.status(200).send({ cid: cid_re });

          } catch (e) {
            console.log('🚀 ~ file: acceptData.ts:64 ~ handler: ~ e:', e);


            return reply.status(500).send({ 'cid': cid_re, 'error': e });
          }
          //console.log("🚀 ~ file: acceptData.ts:64 ~ handler: ~ ret_insert2:", ret_insert2)


        }


        return reply.status(200).send('cid_re:' + cid_re);
      }

      return reply.status(200).send('rwo2');
    },
  });
}


export async function rwoRoute(
  server: FastifyInstance,
  options: FastifyServerOptions,
) {
  server.route({
    method: 'POST',
    url: '/rwo',
    schema: {
      headers: {
        type: 'object',
        properties: {},
        required: [],
      },
    },

    handler: async (request, reply) => {

      return reply.status(200).send('rwo2');
    },
  });
}
  
 