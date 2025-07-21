const { kafkaClient } = require('./kafkaClient');
const { EVENT_TOPICS } = require('../event-types');

async function ensureKafkaTopics() {
  const admin = kafkaClient.admin();
  await admin.connect();
  await admin.createTopics({
    topics: Object.values(EVENT_TOPICS).map(topic => ({
      topic,
      numPartitions: 1,
      replicationFactor: 1
    })),
    waitForLeaders: true,
  });
  console.log('✅ Kafka topics ensured.');
  await admin.disconnect();
}

module.exports = { ensureKafkaTopics };
