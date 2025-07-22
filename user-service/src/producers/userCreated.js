const { kafkaProducer, connectProducer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

async function sendUserCreatedEvent(user) {
  const userData = {
    userId: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    deviceToken: user.deviceToken,
    timestamp: new Date().toISOString(),
  };

  await connectProducer();

  try {
    await kafkaProducer.send({
      topic: EVENT_TOPICS.USER_CREATED,
      messages: [{ value: JSON.stringify(userData) }],
    });

    await kafkaProducer.send({
      topic: EVENT_TOPICS.AUDIT_LOGGED,
      messages: [{ value: JSON.stringify({ eventType: EVENT_TOPICS.USER_CREATED, data: userData }) }],
    });
  } catch (err) {
    await kafkaProducer.send({
      topic: EVENT_TOPICS.AUDIT_FAILED,
      messages: [{
        value: JSON.stringify({
          eventType: EVENT_TOPICS.USER_CREATED,
          error: err.message,
          timestamp: new Date().toISOString(),
        }),
      }],
    });
    throw err;
  }
}

async function sendUserLoggedInEvent(user, email, success) {
  const data = {
    userId: user?.id || null,
    email,
    timestamp: new Date().toISOString(),
  };

  await connectProducer();

  if (success) {
    await kafkaProducer.send({
      topic: EVENT_TOPICS.USER_LOGGED_IN,
      messages: [{ value: JSON.stringify(data) }],
    });

    await kafkaProducer.send({
      topic: EVENT_TOPICS.AUDIT_LOGGED,
      messages: [{ value: JSON.stringify({ eventType: EVENT_TOPICS.USER_LOGGED_IN, data }) }],
    });
  } else {
    await kafkaProducer.send({
      topic: EVENT_TOPICS.AUDIT_FAILED,
      messages: [{
        value: JSON.stringify({
          eventType: EVENT_TOPICS.USER_LOGGED_IN,
          error: 'Invalid login attempt',
          data,
        }),
      }],
    });
  }
}

module.exports = { sendUserCreatedEvent, sendUserLoggedInEvent };
