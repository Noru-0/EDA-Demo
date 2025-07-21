const tap = require('tap');
const fastify = require('fastify')();
fastify.register(require('../../src'));

tap.test('POST /users should create user', async (t) => {
  const response = await fastify.inject({
    method: 'POST',
    url: '/users',
    payload: { name: 'Test User', email: 'test@example.com' },
  });
  t.equal(response.statusCode, 201);
  t.end();
});
