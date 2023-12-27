import dotenv from 'dotenv';
import * as ethers from 'ethers';
import { FastifyInstance, FastifyServerOptions } from 'fastify';
import * as jose from 'jose';
import { JWK } from 'jose';

import keyto from '@trust/keyto';

dotenv.config();

const trusted_pubkeys = (
  process.env['trustpklist']
    ? process.env['trustpklist']
    : '0xf8d34981a0258898893f516e7BB094b8433A9680,0x5aE625186BCd5749a40198Fb6a6bac7AC3CC031E,0x7a73277fa9C4F614Fe0959f27d09CaBeB28b3555'
)
  .replace('0x', '')
  .split(',');
//console.log('🚀 ~ file: index.ts:28 ~ trusted_pubkeys:', trusted_pubkeys);

export default async function TakeDataRoutes(
  server: FastifyInstance,
  options: FastifyServerOptions,
) {
  server.post('/requesttask', {
    handler: async (request, reply) => {
      //todo add in PoW  verification

      if (request.body) {
        try {
          return reply.status(200).send({});
        } catch (e) {
          console.log('🚀 ~ file: index.ts:104 ~ handler: ~ e:', e);
        }
      }

      return reply.status(401).send('Failed');
    },
  });
}
