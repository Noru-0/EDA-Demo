console.log('🚀 Notification consumer is starting...');
const { createConsumer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');
const axios = require('axios');
const nodemailer = require('nodemailer');

// ✅ Cấu hình gửi email bằng SMTP
const emailTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 587,
    secure: false, // dùng TLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

module.exports = async () => {
try {
    console.log('🔍 Starting REGISTRATION_CREATED consumer');
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

        console.log(`📥 Received event:`, data);

        // Gán email mặc định nếu không có userEmail
        const toEmail = userEmail || process.env.DEFAULT_NOTIFICATION_EMAIL;

        if (!eventId || !userId || !toEmail) {
            console.warn('⚠️ Missing required fields: eventId, userId, toEmail');
            return;
        }

        // ✅ Gửi email xác nhận
        await emailTransport.sendMail({
            from: `"EDA Demo" <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: 'Event Registration Confirmation',
            text: `You have successfully registered for event ${eventId}!`,
            html: `<p>You have successfully registered for event <strong>${eventId}</strong>!</p>`,
        });
        console.log(`✅ Email sent to ${toEmail}`);


        // ✅ Gửi log audit
        await axios.post('http://audit-service:3006/audit', {
            eventType: EVENT_TOPICS.REGISTRATION_CREATED,
            data: { eventId, userId, userEmail, timestamp: new Date() },
        });
        console.log(`📤 Audit log sent for event ${eventId}`);

        } catch (error) {
        console.error(`❌ Error processing message:`, error);
        }
    },
    });

    console.log(`🚀 Email Notification Consumer started`);
} catch (err) {
    console.error('❌ Failed to start notification consumer:', err);
    throw err;
}
};
