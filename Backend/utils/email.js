// utils/email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mainaliujjwol7@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
  pool: true,
  maxConnections: 1,
  logger: true,
  debug: true,
});

const generateShortlistEmailBody = (candidateName, jobTitle, companyName) => {
  return `
    <div>
      <h2>Congratulations, ${candidateName}!</h2>
      <p>We are pleased to inform you that you have been shortlisted for the ${jobTitle} position at ${companyName}.</p>
      <p>We will contact you soon with more details regarding the next steps.</p>
      <p>Best regards,</p>
      <p>${companyName}</p>
      


    </div>
  `;
};

const sendShortlistEmail = (
  candidateEmail,
  candidateName,
  jobTitle,
  companyName
) => {
  const subject = `Congratulations on being shortlisted for the ${jobTitle} position`;
  const body = generateShortlistEmailBody(candidateName, jobTitle, companyName);

  const mailOptions = {
    from: "mainaliujjwol7@gmail.com",
    to: candidateEmail,
    subject: subject,
    html: body,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendShortlistEmail,
};
