const eventService = require('../services/eventService');
const { kafkaClient } = require('../../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../../shared/event-types');

const producer = kafkaClient.producer();

module.exports = {
  createEvent: async (request, reply) => {
    const { title, date } = request.body;
    const event = await eventService.createEvent({ title, date });
    await producer.connect();
    await producer.send({
      topic: EVENT_TOPICS.EVENT_CREATED,
      messages: [{ value: JSON.stringify(event) }],
    });
    await producer.disconnect();
    reply.code(201).send(event);
  },
};
