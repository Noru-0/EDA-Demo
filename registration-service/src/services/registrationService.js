const { Registration } = require('../models/registration');

module.exports = {
  createRegistration: async ({ userId, eventId }) => {
    return await Registration.create({ userId, eventId });
  },
};
