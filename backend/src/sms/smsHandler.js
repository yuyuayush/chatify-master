import addSmsToQueue from "../queues/smsQueue.js"

export const paymentSuccessfullSms = async (to) => {
    await addSmsToQueue({
        to,
        message: "Payment Successfull"
    })
}