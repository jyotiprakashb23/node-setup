import nodemailer from "nodemailer";
// import { createTransport,createTestAccount } from "nodemailer";

export const sendConfirmationEmail = async (to,name) => {
  let testAccount = await nodemailer.createTestAccount();

  // connect with the smtp
  let transporter = await nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: '"Avihs Builder" <no-reply@avihs.com>', // sender address
    to: to, // list of receivers
    subject: "Welcome to Avihs Builder 🚀",
    html: `
        <h2>Hello ${name},</h2>
        <p>Thanks for signing up with <b>Avihs Builder</b>.</p>
        <p>Your account has been created successfully! 🎉</p>
        <br>
        <p>Happy building,<br>Team Avihs</p>
      `
  });

  console.log("Message sent: %s", info.messageId);
//   res.json(info);
};

export const sendReminderEmail = async (to,name,text) => {
    let testAccount = await nodemailer.createTestAccount();
  
    // connect with the smtp
    let transporter = await nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    let info = await transporter.sendMail({
      from: '"Avihs Builder" <no-reply@avihs.com>', // sender address
      to: to, // list of receivers
      subject: "Reminder from Avihs Builder 🚀" ,
      html: text
    });
  
    console.log("Message sent: %s", info.messageId);
  //   res.json(info);
  }