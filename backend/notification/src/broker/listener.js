import {consumeFromQueue} from './rabbit.js'
import sendEmail from '../utils/email.js';


function startListening() {


    consumeFromQueue("user_registered",async (data) => {
        const {email , role , fullName:{firstName,lastName}} = data;
         
        const template = ` <h1>Welcome to Spotify_fonk</h1>
        <p>Dear ${firstName} ${lastName},</p>
        <p>Thank you for registering as a ${role} on Spotify_fonk. We're excited to have you on board!</p>
        <p>Best regards,<br/>The Spotify_fonk Team</p>
        `;
        await sendEmail(email, "Welcome to Spotify_fonk", template);
    });
}

export default startListening;
