const fastify = require('fastify')({ logger: true });
const { kafkaClient } = require('../../shared/utils/kafkaClient');
const auth = require('../middleware/authMiddleware');
const apiController = require('../controllers/apiController');
const { ensureKafkaTopics } = require('../shared/utils/kafkaInit');

module.exports = async function (fastify, opts) {
  fastify.register(require('@fastify/cors'), {
    origin: ['http://localhost:3000'],
  });
  fastify.addHook('preHandler', auth);

  fastify.get('/events', apiController.getEvents);
  fastify.post('/registrations', apiController.createRegistration);
};
