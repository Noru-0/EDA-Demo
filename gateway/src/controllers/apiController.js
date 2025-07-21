const { kafkaClient } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

const producer = kafkaClient.producer();

module.exports = {
  getEvents: async (request, reply) => {
    const response = await fetch('http://event-service:3002/events', {
      headers: { Authorization: request.headers['authorization'] },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch events from event-service');
    }
    const events = await response.json();
    reply.send(events);
  },
  createRegistration: async (request, reply) => {
    const { userId, eventId } = request.body;
    await producer.connect();
    await producer.send({
      topic: EVENT_TOPICS.REGISTRATION_CREATED,
      messages: [{ value: JSON.stringify({ userId, eventId }) }],
    });
    await producer.disconnect();
    reply.code(201).send({ message: 'Registration request sent' });
  },
};
