const fastify = require('fastify')({ logger: true });
const config = require('./config/config');

fastify.register(require('./routes'));

const start = async () => {
  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' });
    fastify.log.info(`Gateway running on port ${config.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
