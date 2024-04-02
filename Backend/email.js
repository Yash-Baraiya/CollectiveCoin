const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
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
      from: options.email,
      to: options.email,
      subject: options.subject,
      text: options.message,
      // html:
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendEmail;
