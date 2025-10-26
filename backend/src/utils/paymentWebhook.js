import { sendPaymentSuccessfull } from "../emails/emailHandlers.js";
import { paymentSuccessfullSms } from "../sms/smsHandler.js";


export const paymentSuccessfulWebhook = async (val) => {


    //  saving the data... in database....

    const phoneNumber = "+916398239247";
    const data = {
        email: val.email || "ayushnegi1912@gmail.com",
        type: "Payment Successful",
        userName: val.fullName || "Ayush Negi",
    }
    await sendPaymentSuccessfull(data);
    await paymentSuccessfullSms(phoneNumber);


};