const { kafkaClient, createConsumer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

module.exports = async () => {
  try {
    // Reuse createConsumer to ensure single connection per group
    const consumer = await createConsumer('notification-group');
    
    // Subscribe to topic with fromBeginning: true for processing all messages
    await consumer.subscribe({ 
      topic: EVENT_TOPICS.NOTIFICATION_SENT, 
      fromBeginning: true 
    });

    // Process messages with error handling
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const messageValue = message.value?.toString();
          console.log(`Notification Sent: ${messageValue}`);
        } catch (error) {
          console.error(`Error processing message from topic ${topic} partition ${partition}:`, error);
        }
      },
    });

    // Handle consumer errors
    consumer.on('consumer.crash', ({ payload }) => {
      console.error('Consumer crashed:', payload.error);
    });

    console.log(`✅ Consumer for ${EVENT_TOPICS.NOTIFICATION_SENT} started`);
  } catch (error) {
    console.error('Failed to start consumer:', error);
    throw error;
  }
};
