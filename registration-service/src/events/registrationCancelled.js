const { kafkaClient } = require('../../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../../shared/event-types');

module.exports = async () => {
  const consumer = kafkaClient.consumer({ groupId: 'registration-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: EVENT_TOPICS.REGISTRATION_CANCELLED });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Registration Cancelled: ${message.value.toString()}`);
    },
  });
};
