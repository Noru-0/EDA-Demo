// src/producers/eventUpdated.js
const { kafkaProducer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

module.exports = async function sendEventUpdated(event) {
  try {
    await kafkaProducer.send({
      topic: EVENT_TOPICS.EVENT_UPDATED,
      messages: [
        {
          value: JSON.stringify({
            eventType: EVENT_TOPICS.EVENT_UPDATED,
            data: event,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });

    console.log('📤 Sent EVENT_UPDATED to Kafka:', event);
  } catch (error) {
    console.error('❌ Failed to send EVENT_UPDATED:', error);
  }
};
