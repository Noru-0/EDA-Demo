const fastify = require('fastify')({ logger: true });
const emailController = require('./controllers/emailController');
const emailSent = require('./events/emailSent');
const registrationCreated = require('./events/registrationCreated');
const { ensureKafkaTopics } = require('../shared/utils/kafkaInit');

fastify.post('/emails', emailController.sendEmail);

const start = async () => {
  try {
    await emailSent();
    await ensureKafkaTopics();
    await registrationCreated();
    await fastify.listen({ port: 3005, host: '0.0.0.0' });
    fastify.log.info('Email Service running on port 3005');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
