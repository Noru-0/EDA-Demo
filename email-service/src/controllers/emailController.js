const emailService = require('../services/emailService');

module.exports = {
  sendEmail: async (request, reply) => {
    const { userId, subject, body } = request.body;
    await emailService.sendEmail({ userId, subject, body });
    reply.code(200).send({ message: 'Email sent' });
  },
};
