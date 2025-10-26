const generateBookingEmailTemplate = (data) => `
  <h2>Hi ${data.userName},</h2>
  <p>Your booking for <strong>${data.eventName}</strong> is confirmed.</p>
  <p>Booking Details:</p>
  <ul>
    <li>Event: ${data.eventName}</li>
    <li>Date: ${data.eventDate}</li>
    <li>Seats: ${data.seats}</li>
    <li>Price: ${data.price}</li>
  </ul>
  <p>Thank you for booking with us!</p>
`;

const generateBookingCancelTemplate = (data) => `
  <h2>Hi ${data.userName},</h2>
  <p>We're sorry to inform you that your booking for <strong>${data.eventName}</strong> has been canceled.</p>
  <p>Cancellation Details:</p>
  <ul>
    <li>Event: ${data.eventName}</li>
    <li>Seats: ${data.seats}</li>
    <li>Refund Amount: ${data.price}</li>
  </ul>
  <p>If you have any questions, please contact our support team.</p>
`;

const generatePaymentEmailTemplate = (data) => `
  <h2>Payment Received</h2>
  <p>Hi ${data.userName},</p>
  <p>We have successfully received your payment for <strong>${data.eventName}</strong>.</p>
  <p>Payment Details:</p>
  <ul>
    <li>Amount: ${data.price}</li>
    <li>Payment Method: ${data.paymentMethod}</li>
    <li>Booking ID: ${data.bookingId}</li>
  </ul>
  <p>Thank you for using our service!</p>
`;

const generatePaymentFailedTemplate = (data) => `
  <h2>Payment Failed</h2>
  <p>Hi ${data.userName},</p>
  <p>Unfortunately, your payment for <strong>${data.eventName}</strong> was not successful.</p>
  <p>Payment Details:</p>
  <ul>
    <li>Amount: ${data.price}</li>
    <li>Booking ID: ${data.bookingId}</li>
  </ul>
  <p>Please try again or contact support if the issue persists.</p>
`;

const ticketEmailTemplates = [
    {
        label: "Booking Confirmation",
        generateSubject: (data) => `Your Ticket for ${data.eventName} is Confirmed!`,
        generateBody: generateBookingEmailTemplate,
    },
    {
        label: "Welcome Confirmation",
        generateSubject: (data) => `Your Ticket for ${data.eventName} is Confirmed!`,
        generateBody: generateBookingEmailTemplate,
    },
    {
        label: "Booking Cancellation",
        generateSubject: (data) => `Your Booking for ${data.eventName} Has Been Canceled`,
        generateBody: generateBookingCancelTemplate,
    },
    {
        label: "Payment Received",
        generateSubject: (data) => `💰 Payment Received for ${data.eventName}`,
        generateBody: generatePaymentEmailTemplate,
    },
    {
        label: "Payment Successful",
        generateSubject: (data) => `💰 Payment Successful for ${data.eventName}`,
        generateBody: generatePaymentEmailTemplate,
    },
    {
        label: "Payment Failed",
        generateSubject: (data) => `⚠️ Payment Failed for ${data.eventName}`,
        generateBody: generatePaymentFailedTemplate,
    },
];

 export default ticketEmailTemplates;
