const tap = require('tap');
const emailService = require('../../src/services/emailService');

tap.test('sendEmail should send an email', async (t) => {
  await emailService.sendEmail({ userId: 1, subject: 'Test', body: 'Hello' });
  t.pass('Email sent');
  t.end();
});
