import twilio from "twilio";
import ValidationError from "../utils/errorHandler.js";

const {TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, MESSAGING_SID} = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new ValidationError("Twilio credentials missing in env variables.");
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export const sendSMS = async (to, body) => {
    if (!to) throw new ValidationError("Recipient phone number is required.");
    if (!body) throw new ValidationError("Message body is required.");
    if (!MESSAGING_SID) throw new ValidationError("Twilio Messaging SID missing.");

    const recipients = Array.isArray(to) ? to : [to];

    try {
        const results = await Promise.all(
            recipients.map((recipient) =>
                client.messages.create({
                    body,
                    messagingServiceSid: MESSAGING_SID,
                    to: recipient.startsWith("+") ? recipient : "+" + recipient,
                })
            )
        );
        console.log("SMS sent:", results);
        return results;
    } catch (error) {
        console.error("Twilio error:", error);
        throw new ValidationError("Failed to send SMS: " + error.message);
    }
};
