const nodemailer = require("nodemailer");

// transporteurr....
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525, 
  auth: {
    user: "2c656b6601e7cf", 
    pass: "65e97fe9e95b66" 
  }
});

// envoyer le mail..
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: '"AccessMap Team" <no-reply@accessmap.com>', 
      to, 
      subject, 
      text, 
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
