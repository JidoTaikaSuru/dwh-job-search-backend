import {awsLambdaFastify} from '@fastify/aws-lambda';
import {init} from '../src/index.js';

export const handler = awsLambdaFastify(init())
// or
// const proxy = awsLambdaFastify(app, { binaryMimeTypes: ['application/octet-stream'], serializeLambdaArguments: false /* default is true */ })

// exports.handler = proxy
// or
// @ts-ignore
// exports.handler = (event, context, callback) => proxy(event, context, callback)
// or
// exports.handler = (event, context) => proxy(event, context)
// or
// exports.handler = async (event, context) => proxy(event, context)