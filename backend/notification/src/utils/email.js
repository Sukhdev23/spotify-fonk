import config from "../config/config.js";
import nodemailer from 'nodemailer';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: config.EMAIL_USER,
      clientId: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
      refreshToken: config.REFRESH_TOKEN,
    },
  });


  transporter.verify((error, success) => {
    if (error) {
      console.log('Error with email transporter:', error);
    } else {
      console.log('Email transporter is ready to send messages');
    }
  });

  const sendEmail = async (to, subject, text , html) => {

    try {
        const info = await transporter.sendMail({
            from:  `"Spotify_fonk"<${config.EMAIL_USER}>`,
            to,
            subject,
            text,
            html    
        });
        console.log('Email sent:', info.response);
        console.log("massage preview" ,nodemailer.getTestMessageUrl);
        

    }catch(error) {
        console.error('Error sending email:', error);
     }
  }

  export default sendEmail;