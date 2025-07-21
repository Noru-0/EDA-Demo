const tap = require('tap');
const fastify = require('fastify')();
fastify.register(require('../../src'));

tap.test('POST /emails should send email', async (t) => {
  const response = await fastify.inject({
    method: 'POST',
    url: '/emails',
    payload: { userId: 1, subject: 'Test Email', body: 'Hello' },
  });
  t.equal(response.statusCode, 200);
  t.end();
});
