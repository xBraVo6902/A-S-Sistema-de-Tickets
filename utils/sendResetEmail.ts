import nodemailer from 'nodemailer';

export async function sendResetEmail(email: string, token: string) {
  /**
   const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Configurar en las variables de entorno
      pass: process.env.EMAIL_PASS,  // Configurar en las variables de entorno
    },
  });
  */
 const transporter = nodemailer.createTransport({
    host: 'app.debugmail.io',
    port: 25,
    auth: {
      user: 'ded4e707-8e0e-4dd4-8645-2a292aed897e',
      pass: '73288b15-e03d-436d-b929-ae565842bf61'
    }
  });

  const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperación de contraseña',
    text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`,
  };

  await transporter.sendMail(mailOptions);
}