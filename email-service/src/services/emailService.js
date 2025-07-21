const { kafkaClient } = require('../../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../../shared/event-types');

const producer = kafkaClient.producer();

module.exports = {
  sendEmail: async ({ userId, subject, body }) => {
    console.log(`Sending email to user ${userId}: ${subject}`);
    await producer.connect();
    await producer.send({
      topic: EVENT_TOPICS.EMAIL_SENT,
      messages: [{ value: JSON.stringify({ userId, subject, body }) }],
    });
    await producer.disconnect();
  },
};
