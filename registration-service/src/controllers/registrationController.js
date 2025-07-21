const registrationService = require('../services/registrationService');
const { kafkaClient } = require('../../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../../shared/event-types');

const producer = kafkaClient.producer();

module.exports = {
  createRegistration: async (request, reply) => {
    const { userId, eventId } = request.body;
    const registration = await registrationService.createRegistration({ userId, eventId });
    await producer.connect();
    await producer.send({
      topic: EVENT_TOPICS.REGISTRATION_CREATED,
      messages: [{ value: JSON.stringify(registration) }],
    });
    await producer.disconnect();
    reply.code(201).send(registration);
  },
};
