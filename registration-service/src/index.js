const fastify = require('fastify')({ logger: true });
const registrationController = require('./controllers/registrationController');
const { ensureKafkaTopics } = require('../shared/utils/kafkaInit');
const registrationEvent = require('./events/registrationCreated');

fastify.post('/registrations', registrationController.createRegistration);

const start = async () => {
  try {
    await ensureKafkaTopics();             // 👈 THÊM DÒNG NÀY
    await registrationEvent();             // consumer
    await fastify.listen({ port: 3003, host: '0.0.0.0' });
    fastify.log.info('Registration Service running on port 3003');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
