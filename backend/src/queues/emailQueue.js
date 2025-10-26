// queues/emailQueue.js
import { Queue } from 'bullmq';
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_USERNAME } = process.env;


const connection = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
}
const defaultJobOptions = {
    removeOnComplete: true, // cleanup
    removeOnFail: false,
    attempts: 3, // retry 3 times
    backoff: {
        type: 'exponential',
        delay: 5000,
    }
}

const emailQueue = new Queue('emailQueue', {
    connection,
    defaultJobOptions,
});

async function addEmailToQueue(data) {
    await emailQueue.add('sendEmail', {
        to: data.email,
        type: data.type, // should match one of the template labels
        userName: data.userName,
        eventName: data.eventName,
        eventDate: data.eventDate,
        seats: data.seats,
        price: data.price,
    });
}

export default addEmailToQueue;
