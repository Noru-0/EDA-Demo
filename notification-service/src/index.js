const fastify = require('fastify')({ logger: true });
const notificationController = require('./controllers/notificationController');
const notificationSent = require('./events/notificationSent');
const registrationCreated = require('./events/registrationCreated');

fastify.post('/notifications', notificationController.sendNotification);

const start = async () => {
  try {
    await notificationSent();
    await ensureKafkaTopics();
    await registrationCreated();
    await fastify.listen({ port: 3004 });
    fastify.log.info('Notification Service running on port 3004');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
