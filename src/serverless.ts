import { FastifyReply, FastifyRequest } from 'fastify';
import { server } from './index.js';

export default async (req: FastifyRequest, res: FastifyReply) => {
  await server.ready();
  server.server.emit('request', req, res);
}