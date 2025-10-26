
import { Worker } from 'bullmq';
import { sendSMS } from "../config/twillo.js";
const { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD } = process.env;

const connection = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD
}

const smsWorker = new Worker(
    'smsQueue',
    async(job) => {
      await sendSMS(job.data.to, job.data.message);
    },
    {
        connection,
    }
);


smsWorker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`);
});

smsWorker.on('failed', (job, err) => {
    console.log(`❌ Job ${job.id} failed: ${err.message}`);
});

export default { smsWorker };
