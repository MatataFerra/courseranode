const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'elroy.smitham9@ethereal.email',
      pass: 'p1HTS6NbA7GGPQ3AXZ'
  }
});

module.exports = nodemailer.createTransport(mailConfig)