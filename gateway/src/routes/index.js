const fastify = require('fastify')({ logger: true });
const { kafkaClient } = require('../../../shared/utils/kafkaClient');
const auth = require('../middleware/auth');
const apiController = require('../controllers/apiController');

module.exports = async function (fastify, opts) {
  fastify.register(require('@fastify/cors'));
  fastify.addHook('preHandler', auth);

  fastify.get('/events', apiController.getEvents);
  fastify.post('/registrations', apiController.createRegistration);
};
