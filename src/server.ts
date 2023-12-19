import {init} from './index.js';

const server = await init();
server.listen(
  {
    port: process.env['port'] ? parseInt(process.env['port']) : 8080,
    host: '0.0.0.0',
  },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  },
);

const listeners = ['SIGINT', 'SIGTERM'];
listeners.forEach((signal) => {
  process.on(signal, async () => {
    await server.close();
    process.exit(0);
  });
});
