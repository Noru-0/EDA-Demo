// email-service/src/events/registrationCreated.js
const { kafkaClient } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');
const { sendEmail } = require('../services/emailService');

module.exports = async () => {
  const consumer = kafkaClient.consumer({ groupId: 'email-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: EVENT_TOPICS.REGISTRATION_CREATED });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log(`📥 New registration received in Email Service:`, data);

      // Gửi email cho người dùng mới đăng ký
      await sendEmail({
        userId: data.userId,
        subject: 'Welcome!',
        body: `Hello ${data.name || 'user'}, welcome to our system!`,
      });
    },
  });
};
