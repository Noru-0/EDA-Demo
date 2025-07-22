const fastify = require('fastify')({ logger: true });
const notificationController = require('./controllers/notificationController');
const notificationSent = require('./producers/notificationSent');
const { ensureKafkaTopics } = require('../shared/utils/kafkaInit');
const consumeRegistrationCreated = require('./consumers/registrationCreated');
// const { consumeUserCreated } = require('./consumers/userCreated');

fastify.post('/notifications', notificationController.sendNotification);

const start = async () => {
  try {
    await ensureKafkaTopics();
    await consumeRegistrationCreated();
    await notificationSent();
    // await consumeUserCreated();
    await fastify.listen({ port: 3004, host: '0.0.0.0' });
    fastify.log.info('Notification Service running on port 3004');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
