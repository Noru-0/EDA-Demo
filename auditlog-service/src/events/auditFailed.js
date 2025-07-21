const { kafkaClient } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

module.exports = async () => {
  const consumer = kafkaClient.consumer({ groupId: 'audit-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: EVENT_TOPICS.AUDIT_FAILED });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Audit Failed: ${message.value.toString()}`);
    },
  });
};
