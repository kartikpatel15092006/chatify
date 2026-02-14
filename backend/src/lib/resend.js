const resend = require('resend');


const resendClient = new resend.Resend(process.env.RESEND_API_KEY);
const sender = {
    name: process.env.EMAIL_FROM_NAME,
  email: process.env.EMAIL_FROM
}
module.exports = { resendClient , sender};
