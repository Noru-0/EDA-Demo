const auditService = require('../services/auditService');

module.exports = {
  logAudit: async (request, reply) => {
    const { eventType, data } = request.body;
    await auditService.logAudit({ eventType, data });
    reply.code(200).send({ message: 'Audit logged' });
  },
};
