const userService = require('../services/userService');
const { kafkaClient } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

const producer = kafkaClient.producer();

module.exports = {
  createUser: async (request, reply) => {
    const { name, email } = request.body;
    const user = await userService.createUser({ name, email });
    await producer.connect();
    await producer.send({
      topic: EVENT_TOPICS.USER_CREATED,
      messages: [{ value: JSON.stringify(user) }],
    });
    await producer.disconnect();
    reply.code(201).send(user);
  },
};
