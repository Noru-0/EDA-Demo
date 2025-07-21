const { User } = require('../models/user');

module.exports = {
  createUser: async ({ name, email }) => {
    return await User.create({ name, email });
  },
};
