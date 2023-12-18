import { FastifyReply } from 'fastify';
import { supabaseClient } from './index.js';

export const genericFetchById = async (
  tableName: string,
  id: string,
  reply: FastifyReply,
) => {

  console.log(`fetching ${tableName} by Id`, id);
  const { data, error } =
    await supabaseClient
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();
  console.log('data', data, 'error', error);

  if (error) {
    return reply.status(500).send(error);
  }
  if (!data) {
    return reply.status(404).send('Job listing not found');
  }

  return reply.send(data);
};
export const genericFetchAll = async (tableName: string,
                                      reply: FastifyReply) => {
  console.log('fetching all companies');
  const { data, error } =
    await supabaseClient
      .from(tableName)
      .select('*');
  if (error) {
    return reply.status(500).send(error);
  }
  return reply.send(data || []);
};
export const genericCreate = async <T>(tableName: string,
                                       body: T,
                                       reply: FastifyReply) => {
  const { data, error } = await supabaseClient.from(tableName).insert(body).select().single();
  if (error) {
    return reply.status(400).send(error);
  }
  return reply.send(data);
};
export const genericUpdate = async <T>(tableName: string,
                                       body: T,
                                       reply: FastifyReply) => {
  const { data, error } = await supabaseClient.from(tableName).update(body).select().single();
  if (error) {
    return reply.status(400).send(error);
  }
  return reply.send(data);
};