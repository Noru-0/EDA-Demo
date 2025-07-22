console.log('🚀 Notification consumer is starting...');

const { createConsumer, kafkaProducer, connectProducer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');
const nodemailer = require('nodemailer');

const emailTransport = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = async () => {
  try {
    await connectProducer();
    const consumer = await createConsumer('notification-group');

    await consumer.subscribe({
      topic: EVENT_TOPICS.REGISTRATION_CREATED,
      fromBeginning: true,
    });

    console.log(`✅ Subscribed to topic: ${EVENT_TOPICS.REGISTRATION_CREATED}`);

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        console.log('🔥 Message received:', message.value?.toString());

        try {
          const data = JSON.parse(message.value?.toString() || '{}');
          const { eventId, userId, userEmail } = data;
          const toEmail = userEmail || process.env.DEFAULT_NOTIFICATION_EMAIL;

          if (!eventId || !userId || !toEmail) {
            console.warn('⚠️ Missing required fields: eventId, userId, toEmail');
            return;
          }

          // ✅ Send confirmation email
          await emailTransport.sendMail({
            from: `"EDA Demo" <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: 'Event Registration Confirmation',
            text: `You have successfully registered for event ${eventId}!`,
            html: `<p>You have successfully registered for event <strong>${eventId}</strong>!</p>`,
          });

          console.log(`✅ Email sent to ${toEmail}`);

          // 📤 Send audit.logged event
          await kafkaProducer.send({
            topic: EVENT_TOPICS.AUDIT_LOGGED,
            messages: [
              {
                value: JSON.stringify({
                  eventType: EVENT_TOPICS.REGISTRATION_CREATED,
                  data: { eventId, userId, userEmail: toEmail, timestamp: new Date().toISOString() },
                }),
              },
            ],
          });

          console.log(`📤 Audit log event sent to ${EVENT_TOPICS.AUDIT_LOGGED}`);
        } catch (error) {
          console.error(`❌ Error processing message:`, error);

          // 📤 Send notification.failed event
          await kafkaProducer.send({
            topic: EVENT_TOPICS.NOTIFICATION_FAILED,
            messages: [
              {
                value: JSON.stringify({
                  originalEvent: EVENT_TOPICS.REGISTRATION_CREATED,
                  error: error.message,
                  timestamp: new Date().toISOString(),
                }),
              },
            ],
          });

          console.warn(`⚠️ Sent ${EVENT_TOPICS.NOTIFICATION_FAILED} event`);
        }
      },
    });

    console.log(`🚀 Email Notification Consumer started`);
  } catch (err) {
    console.error('❌ Failed to start notification consumer:', err);
    throw err;
  }
};
