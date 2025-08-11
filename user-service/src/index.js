const fastify = require('fastify')({ logger: true });
const userController = require('./controllers/userController');
const sequelize = require('./utils/db');
const { ensureKafkaTopics } = require('../shared/utils/kafkaInit');

const start = async () => {
  try {
    // Đăng ký route
    fastify.post('/users', userController.createUser);
    fastify.post('/auth/login', userController.loginUser);

    await ensureKafkaTopics();
    await sequelize.sync();
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    fastify.log.info('User Service running on port 3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
