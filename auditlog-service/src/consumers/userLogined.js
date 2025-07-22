const { kafkaClient, createConsumer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');
const { logAudit } = require('../producers/auditLogged');

module.exports = async () => {
  try {
    const consumer = await createConsumer('audit-group');
    await consumer.subscribe({ topic: EVENT_TOPICS.USER_LOGINED, fromBeginning: true });
    console.log(`✅ Subscribed to topic: ${EVENT_TOPICS.USER_LOGINED}`);
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value?.toString() || '{}');
          const { userId, username, userEmail, timestamp } = data;
          console.log(`📥 Received ${EVENT_TOPICS.USER_LOGINED}:`, data);
          if (!userId) {
            console.warn('⚠️ Missing userId');
            return;
          }
          await logAudit({
            eventType: EVENT_TOPICS.USER_LOGINED,
            data: { userId, username, userEmail, timestamp },
          });
          console.log(`✅ Audit log created for ${EVENT_TOPICS.USER_LOGINED}`);
        } catch (error) {
          console.error(`❌ Error processing ${topic} partition ${partition}:`, error);
        }
      },
    });
    console.log(`🚀 Consumer for ${EVENT_TOPICS.USER_LOGINED} started`);
  } catch (error) {
    console.error('❌ Failed to start USER_LOGINED consumer:', error);
    throw error;
  }
};
