const { AuditLog } = require('../models/auditLog');
const { kafkaClient } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

const producer = kafkaClient.producer();

module.exports = {
  logAudit: async ({ eventType, data }) => {
    const log = await AuditLog.create({ eventType, data });
    await producer.connect();
    await producer.send({
      topic: EVENT_TOPICS.AUDIT_LOGGED,
      messages: [{ value: JSON.stringify(log) }],
    });
    await producer.disconnect();
  },
};
