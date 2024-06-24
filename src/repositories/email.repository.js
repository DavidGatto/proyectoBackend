import nodemailer from "nodemailer";

class EmailManager {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: "razetech6@gmail.com",
        pass: "yeny ascs uqhs zcdh",
      },
    });
  }

  async sendMailPurchase(email, first_name, ticket) {
    try {
      const mailOptions = {
        from: "Raze Tech <razetech6@gmail.com>",
        to: email,
        subject: "Purchase Confirmation",
        html: `
                    <h1>Purchase Confirmation</h1>
                    <p>Thank you for your purchase, ${first_name}!</p>
                    <p>Your order number is: ${ticket}</p>
                `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
    }
  }

  async sendMailReset(email, first_name, token) {
    try {
      const mailOptions = {
        from: "razetech6@gmail.com",
        to: email,
        subject: "Password Reset",
        html: `
                    <h1>Password Reset</h1>
                    <p>Hello ${first_name},</p>
                    <p>You have requested to reset your password. Use the following code to change your password:</p>
                    <p><strong>${token}</strong></p>
                    <p>This code will expire in 1 hour.</p>
                    <a href="http://localhost:8080/password">Reset Password</a>
                    <p>If you did not request this reset, please ignore this email.</p>
                `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Error sending email");
    }
  }

  async sendMailDeletion(email, first_name) {
    try {
      const mailOptions = {
        from: "Raze Tech <razetech6@gmail.com>",
        to: email,
        subject: "Account deleted due to inactivity",
        html: `
          <h1>Account Deleted</h1>
          <p>Hello ${first_name},</p>
          <p>Your account has been deleted due to inactivity for the past 2 days.</p>
          <p>If you have any questions, please contact us.</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Error sending email");
    }
  }
}

export default EmailManager;
