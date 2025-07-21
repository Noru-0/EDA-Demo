const tap = require('tap');
const userService = require('../../src/services/userService');

tap.test('createUser should create a user', async (t) => {
  const user = await userService.createUser({ name: 'Test', email: 'test@example.com' });
  t.ok(user);
  t.equal(user.name, 'Test');
  t.end();
});
