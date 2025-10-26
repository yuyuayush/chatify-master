import { Worker } from "bullmq";
import ticketEmailTemplates  from "../utils/emailTemplate.js";
import { sendEmail } from "../config/sendGrid.js";

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_USERNAME, SENDGRID_FROM_EMAIL } = process.env;

const connection = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  username: REDIS_USERNAME,
  password: REDIS_PASSWORD,
};

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { to, type, ...data } = job.data;

    const template = ticketEmailTemplates.find((t) => t.label === type);
    if (!template) throw new Error(`Email template not found for type: ${type}`);

    const msg = {
      to,
      from: SENDGRID_FROM_EMAIL,
      subject: template.generateSubject(data),
      html: template.generateBody(data),
    };

    await sendEmail(msg);
    console.log(`📧 Email sent to ${to} for ${type}`);
  },
  { connection }
);

emailWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});

emailWorker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} completed successfully`);
});

export default {emailWorker};
