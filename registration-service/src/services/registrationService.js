const { kafkaProducer, connectProducer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');
const { Registration } = require('../models/registration');

async function registerForEvent(eventId, userId, userEmail, userPhone, userDeviceToken) {
  try {
    if (!eventId || !userId) {
      throw new Error('Missing required fields: eventId or userId');
    }

    console.log(`🔍 Creating registration for event: ${eventId}, user: ${userId}`);
    const registration = await Registration.create({ eventId, userId });
    console.log(`✅ Registration created with ID: ${registration.id}`);

    await connectProducer();

    const registrationEvent = {
      eventId,
      userId,
      userEmail,
      userPhone,
      userDeviceToken,
      timestamp: new Date().toISOString(),
    };

    // 📤 Emit REGISTRATION_CREATED event
    await kafkaProducer.send({
      topic: EVENT_TOPICS.REGISTRATION_CREATED,
      messages: [{ value: JSON.stringify(registrationEvent) }],
    });
    console.log(`📤 Kafka event sent to ${EVENT_TOPICS.REGISTRATION_CREATED}:`, registrationEvent);

    // 📤 Emit AUDIT_LOGGED event instead of HTTP request
    const auditEvent = {
      eventType: EVENT_TOPICS.REGISTRATION_CREATED,
      data: {
        eventId,
        userId,
        timestamp: new Date().toISOString(),
      },
    };

    await kafkaProducer.send({
      topic: EVENT_TOPICS.AUDIT_LOGGED,
      messages: [{ value: JSON.stringify(auditEvent) }],
    });
    console.log(`📝 Audit event sent to ${EVENT_TOPICS.AUDIT_LOGGED}`);

    return registration;
  } catch (error) {
    console.error('❌ Error registering for event:', error);

    // Gửi audit.failed nếu muốn
    try {
      await kafkaProducer.send({
        topic: EVENT_TOPICS.AUDIT_FAILED,
        messages: [{
          value: JSON.stringify({
            eventType: EVENT_TOPICS.REGISTRATION_CREATED,
            error: error.message,
            timestamp: new Date().toISOString(),
          }),
        }],
      });
      console.warn(`⚠️ Sent ${EVENT_TOPICS.AUDIT_FAILED} event`);
    } catch (failError) {
      console.error('❌ Failed to send audit.failed event:', failError);
    }

    throw error;
  }
}

module.exports = { registerForEvent };
