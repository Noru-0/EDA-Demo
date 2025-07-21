const fastify = require('fastify')({ logger: true });
const auditController = require('./controllers/auditController');
const mongoose = require('./utils/db');
const auditLogged = require('./events/auditLogged');

fastify.post('/audit', auditController.logAudit);

const start = async () => {
  try {
    await mongoose.connection;
    await auditLogged();
    await fastify.listen({ port: 3006, host: '0.0.0.0' });
    fastify.log.info('Auditlog Service running on port 3006');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
