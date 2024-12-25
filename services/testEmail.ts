import emailService from "./emailService";

const mailOptions = {
  to: "rakifih471@owube.com",
  subject: "Hello from Nodemailer",
  text: "This is a test email sent using Nodemailer.",
};

await emailService.sendEmail(mailOptions);
