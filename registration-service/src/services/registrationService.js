const { Registration } = require('../models/registration');

module.exports = {
  createRegistration: async ({ userId, eventId }) => {
    const created = await Registration.create({ userId, eventId });
    return created.toJSON(); // 👈 ép về plain object để JSON.stringify đầy đủ
  },
};
