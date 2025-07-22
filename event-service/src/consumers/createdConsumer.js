const { kafkaClient, createConsumer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');
const { Event } = require('../models/event');
const sendEventUpdated = require('../producers/eventUpdated'); // 👈 THÊM VÀO

module.exports = async function consumeRegistrationCreated() {
  try {
    console.log('🔍 Starting REGISTRATION_CREATED consumer');

    const groupId = 'event-group';
    const consumer = await createConsumer(groupId);

    await consumer.subscribe({
      topic: EVENT_TOPICS.REGISTRATION_CREATED,
      fromBeginning: true,
    });
    console.log('✅ Subscribed to topic:', EVENT_TOPICS.REGISTRATION_CREATED);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value?.toString());
          const { eventId } = data;
          console.log('📥 Received registration event:', data);

          if (!eventId) {
            console.warn('⚠️ Missing eventId in message:', data);
            return;
          }

          await Event.increment('registered', { where: { id: eventId } });
          console.log(`✅ Updated registered count for event: ${eventId}`);

          const updatedEvent = await Event.findByPk(eventId);
          if (updatedEvent) {
            await sendEventUpdated(updatedEvent); // 👈 GỬI LÊN KAFKA
          }
        } catch (error) {
          console.error(`Error processing message from topic ${topic} partition ${partition}:`, error);
        }
      },
    });

    consumer.on('consumer.crash', ({ payload }) => {
      console.error('Consumer crashed:', payload.error);
    });

    console.log(`🚀 Consumer for ${EVENT_TOPICS.REGISTRATION_CREATED} started`);
  } catch (error) {
    console.error('❌ Failed to start REGISTRATION_CREATED consumer:', error);
    throw error;
  }
};
