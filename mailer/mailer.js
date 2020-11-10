const nodemailer = require("nodemailer");
const sgTransport = require('nodemailer-sendgrid-transport')

let mailConfig;

//API KEY SENDGRID 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

if(process.env.NODE_ENV === 'production'){
  const options = {
    auth: {
      api_key: process.env.SENGRID_API_SECRET
    }
  }

  mailConfig = sgTransport(options)
} else {
  if(process.env.NODE_ENV === 'staging'){
    console.log('XXXXXXXXXX');
    const options = {
      auth: {
        api_key: process.env.SENGRID_API_SECRET
      }
    }

    mailConfig = sgTransport(options)
  } else {
    mailConfig = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'elroy.smitham9@ethereal.email',
          pass: 'p1HTS6NbA7GGPQ3AXZ'
      }
    });
  }
}

module.exports = nodemailer.createTransport(mailConfig)