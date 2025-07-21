const fastify = require('fastify')({ logger: true });
const eventController = require('./controllers/eventController');
const sequelize = require('./utils/db');
const eventCreated = require('./events/eventCreated');

fastify.post('/events', eventController.createEvent);
fastify.get('/events', eventController.getEvents);

const start = async () => {
  try {
    await sequelize.sync();
    await eventCreated();
    await fastify.listen({ port: 3002 });
    fastify.log.info('Event Service running on port 3002');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();