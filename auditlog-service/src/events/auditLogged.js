const { kafkaClient } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

module.exports = async () => {
  const consumer = kafkaClient.consumer({ groupId: 'audit-group' });
  await consumer.connect();
  await consumer.subscribe({ topics: [
    EVENT_TOPICS.USER_CREATED,
    EVENT_TOPICS.EVENT_CREATED,
    EVENT_TOPICS.REGISTRATION_CREATED,
    EVENT_TOPICS.AUDIT_LOGGED,
  ] });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value.toString());
      await require('../services/auditService').logAudit({ eventType: topic, data });
    },
  });
};
