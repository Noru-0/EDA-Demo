const { createConsumer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

module.exports = async function consumeRegistrationCreated() {
  try {
    const consumer = await createConsumer('registration-group');

    await consumer.subscribe({
      topic: EVENT_TOPICS.REGISTRATION_CREATED,
      fromBeginning: true,
    });
    console.log(`✅ Subscribed to topic: ${EVENT_TOPICS.REGISTRATION_CREATED}`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = JSON.parse(message.value.toString());
        console.log('📥 Registration Created:', data);
        // Nếu cần xử lý tiếp: ví dụ ghi log DB, gửi email, v.v...
      },
    });

    console.log('🚀 Consumer is now running...');
  } catch (err) {
    console.error('❌ Failed to consume REGISTRATION_CREATED:', err);
  }
};
