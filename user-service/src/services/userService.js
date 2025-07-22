const { kafkaProducer, connectProducer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');
const { User } = require('../models/user'); // Sequelize User model

async function createUser({ username, email, password, phone, deviceToken }) {
  try {
    console.log('🔍 createUser service called with data:', { username, email, password, phone, deviceToken });

    const user = await User.create({ username, email, password, phone, deviceToken });

    const userData = {
      userId: user.id,
      username,
      email,
      phone,
      deviceToken,
      timestamp: new Date().toISOString(),
    };

    await connectProducer();

    // Gửi USER_CREATED
    await kafkaProducer.send({
      topic: EVENT_TOPICS.USER_CREATED,
      messages: [{ value: JSON.stringify(userData) }],
    });

    // Gửi AUDIT_LOGGED
    await kafkaProducer.send({
      topic: EVENT_TOPICS.AUDIT_LOGGED,
      messages: [
        {
          value: JSON.stringify({
            eventType: EVENT_TOPICS.USER_CREATED,
            data: userData,
          }),
        },
      ],
    });

    return user;
  } catch (error) {
    await kafkaProducer.send({
      topic: EVENT_TOPICS.AUDIT_FAILED,
      messages: [
        {
          value: JSON.stringify({
            eventType: EVENT_TOPICS.USER_CREATED,
            error: error.message,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
    throw error;
  }
}

async function authenticateUser(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.validatePassword(password))) {
    throw new Error('Invalid email or password');
  }
  return user;
}

module.exports = { createUser, authenticateUser };
