const { Event } = require('../models/event');

module.exports = {
  createEvent: async ({ title, date }) => {
    return await Event.create({ title, date });
  },
};
