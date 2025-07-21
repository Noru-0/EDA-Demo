const auth = require('../middleware/authMiddleware');
const apiController = require('../controllers/apiController');

module.exports = async function (fastify, opts) {
  // Đăng ký CORS
  await fastify.register(require('@fastify/cors'), {
    origin: ['http://localhost:3000'],
  });

  // Hook xác thực (middleware)
  fastify.addHook('preHandler', async (request, reply) => {
    await auth(request, reply); // hoặc auth(request, reply) nếu không async
  });

  // Khai báo route
  fastify.get('/events', apiController.getEvents);
  fastify.post('/registrations', apiController.createRegistration);
};
