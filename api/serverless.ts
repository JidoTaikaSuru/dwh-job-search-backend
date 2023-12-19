import { FastifyReply, FastifyRequest } from 'fastify';
import { init } from '../src/index.js';
// import dotenv from 'dotenv';

// dotenv.config();
// console.log(process.env)
export default async (req: FastifyRequest, res: FastifyReply) => {
  const server = await init()
  await server.ready();
  server.server.emit('request', req, res);
}
