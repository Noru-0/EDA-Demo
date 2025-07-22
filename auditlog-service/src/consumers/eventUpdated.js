const { kafkaClient, createConsumer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');
const { logAudit } = require('../producers/auditLogged');

module.exports = async () => {
  try {
    const consumer = await createConsumer('audit-group');
    
    await consumer.subscribe({ 
      topic: EVENT_TOPICS.UPDATE_EVENT, 
      fromBeginning: true 
    });
    console.log(`✅ Subscribed to topic: ${EVENT_TOPICS.UPDATE_EVENT}`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value?.toString() || '{}');
          const { eventId, updatedFields, updatedBy } = data;
          console.log(`📥 Received ${EVENT_TOPICS.UPDATE_EVENT} for audit:`, data);

          if (!eventId) {
            console.warn('⚠️ Missing eventId in message:', data);
            return;
          }

          await logAudit({
            eventType: EVENT_TOPICS.UPDATE_EVENT,
            data: { eventId, updatedFields, updatedBy, timestamp: data.timestamp || new Date().toISOString() },
          });
          console.log(`✅ Audit log created for ${EVENT_TOPICS.UPDATE_EVENT}`);

        } catch (error) {
          console.error(`❌ Error processing message from topic ${topic} partition ${partition}:`, error);
        }
      },
    });

    consumer.on('consumer.crash', ({ payload }) => {
      console.error('❌ Consumer crashed:', payload.error);
    });

    console.log(`🚀 Consumer for ${EVENT_TOPICS.UPDATE_EVENT} started`);
  } catch (error) {
    console.error('❌ Failed to start UPDATE_EVENT audit consumer:', error);
    throw error;
  }
};
