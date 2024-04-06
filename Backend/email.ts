import * as nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";

const sendEmail = async (options :MailOptions) => {
  try {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    // 2) Define the email options
    const mailOptions = {
      from: options.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      // html:
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};
export default sendEmail;
