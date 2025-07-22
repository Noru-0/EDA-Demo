const userService = require('../services/userService');

module.exports = {
  createUser: async (request, reply) => {
    try {
      request.log.info('🔍 createUser controller called with body:', request.body);
      const { username, email, password, phone, deviceToken } = request.body;

      if (!username || !email || !password) {
        return reply.code(400).send({ error: 'Missing required fields: username, email, password' });
      }

      const user = await userService.createUser({ username, email, password, phone, deviceToken });
      reply.code(201).send(user);
    } catch (error) {
      request.log.error('❌ Error in createUser controller:', error);
      if (error.name === 'SequelizeValidationError') {
        return reply.code(400).send({ error: error.errors.map(e => e.message) });
      }
      reply.code(500).send({ error: error.message });
    }
  },

  loginUser: async (request, reply) => {
    try {
      const { email, password } = request.body;
      if (!email || !password) {
        return reply.code(400).send({ error: 'Missing email or password' });
      }

      const user = await userService.authenticateUser(email, password);
      reply.code(200).send({ message: 'Login successful', user });
    } catch (error) {
      reply.code(401).send({ error: error.message });
    }
  },
};
