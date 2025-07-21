const { kafkaClient } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

module.exports = async () => {
  const consumer = kafkaClient.consumer({ groupId: 'event-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: EVENT_TOPICS.EVENT_CREATED });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Event Created: ${message.value.toString()}`);
    },
  });
};
