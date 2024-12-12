const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bcmths1949@gmail.com",
      pass: "lucc vxhe nmjg aszl",
    },
  });

  const mailOptions = {
    from: "bcmths1949@gmail.com",
    to: email,
    subject: subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
