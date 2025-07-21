// notification-service/src/events/registrationCreated.js
const { kafkaClient } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');
const { sendNotification } = require('../services/notificationService'); // ✅ gọi từ service

module.exports = async () => {
  const consumer = kafkaClient.consumer({ groupId: 'notification-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: EVENT_TOPICS.REGISTRATION_CREATED });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log(`📩 New registration received:`, data);

      // Gọi service logic (KHÔNG phải controller)
      await sendNotification(data);
    },
  });
};
