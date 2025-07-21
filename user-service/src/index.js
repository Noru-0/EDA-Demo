const fastify = require('fastify')({ logger: true });
const userController = require('./controllers/userController');
const sequelize = require('./utils/db');
const userCreated = require('./events/userCreated');
const { ensureKafkaTopics } = require('../shared/utils/kafkaInit');

fastify.post('/users', userController.createUser);

const start = async () => {
  try {
    await ensureKafkaTopics();
    await sequelize.sync();
    await userCreated();
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    fastify.log.info('User Service running on port 3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
