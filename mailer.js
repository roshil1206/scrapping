const nodemailer = require("nodemailer");
process.loadEnvFile();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Mailer_User,
    pass: process.env.Mailer_Password, // Your Gmail password or app-specific password
  },
});
const sendEmail = async (mailOptions) => {
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = sendEmail;
