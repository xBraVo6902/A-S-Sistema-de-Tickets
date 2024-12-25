import nodemailer from "nodemailer";
import "dotenv/config";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || "Gmail",
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail({ to, subject, text, html }: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        text,
        html,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }
}

const emailService = new EmailService();
export default emailService;
